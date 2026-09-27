/**
 * Pictures as text: vertical bars traced from an image, set back in Wavefont.
 * A piece is horizontal slices; a slice is lines of bars `[x, width, top, bottom, …]` in pixels of the trace.
 * One bar a character, its weight the bar's width, each standing at its own x, shifted by marks to its own height.
 */
import { char, shift } from '../index.js'

const WIDEST = 0.25 // em: the advance at wght 1000

/**
 * Font size for a piece at scale s: one for all its slices, as each size and weight is a font of its own and
 * engines keep a couple of hundred. It puts every slice's top at level 126 at most – a band meets the one above it,
 * no hairline between, and a bar can still take its extra level (see bar) under 127; and it lets the widest bar, and
 * a device pixel of seam, be one character.
 */
const size = (piece, s, px) => {
  let F = 0
  for (const slice of piece.slices) for (const line of slice.lines) {
    if (line.length) F = Math.max(F, slice.h * s / 1.255)
    for (let i = 1; i < line.length; i += 4) F = Math.max(F, (line[i] * s + px) / WIDEST)
  }
  return +F.toFixed(3)
}

/**
 * A bar from level lo to level hi, levels 0–127 across a line box of `line-height: 1.28`, 64 its middle: the value
 * of its height, centred, shifted by marks from the middle to its own. A shift is whole steps, so where lo + hi is
 * odd the bar takes a level more at its top – it overlaps the next rather than leaving a hairline.
 */
export const bar = (lo, hi) => {
  const odd = (lo + hi) & 1
  return char(hi - lo + odd) + shift((lo + hi + odd) / 2 - 64)
}

/**
 * Level L sits 10L − 140 units above the baseline, so a slice's box of font size F with its bottom on the slice
 * bottom puts level L at L·F/100 px above it.
 * Each bar stands at its own x, on a device pixel (px, in CSS px), rather than where the bars before it carry the pen:
 * engines round every run of text their own way – Blink up to 1/64 px, Firefox to whole font units – and along
 * a line of spans the roundings add up, until touching bars part.
 * Returns the slice's style and its bars, each [x, wght, text].
 */
const row = (slice, pieceH, s, px, F) => {
  const all = []
  for (const line of slice.lines) for (let i = 0; i < line.length; i += 4) all.push(line.slice(i, i + 4))
  all.sort((p, q) => p[0] - q[0])
  const level = y => (slice.h - y) * s / F * 100
  const edge = x => Math.round(x * s / px) * px
  const parts = []
  for (const [x, w, top, bottom] of all) {
    const a = edge(x), b = Math.max(a + px, edge(x + w))
    const ch = bar(Math.max(0, Math.floor(level(bottom))), Math.min(127, Math.ceil(level(top))))
    // a bar wider than a character's widest is set as several, each starting on a device pixel
    const k = Math.ceil((b - a + px) / (WIDEST * F)), cut = j => a + Math.round((b - a) * j / k / px) * px
    for (let j = 0; j < k; j++) parts.push([cut(j), cut(j + 1), ch, j < k - 1])
  }
  const bars = parts.map(([a, b, ch, joined], i) => {
    // touching bars overlap by a device pixel: no hairline between
    const w = b - a + (joined || (parts[i + 1]?.[0] ?? Infinity) - b < px ? px : 0)
    return [+a.toFixed(4), +Math.min(1000, Math.max(4, w / F * 4000)).toFixed(1), ch]
  })
  const bottom = (pieceH - slice.y - slice.h) * s
  return { style: `font-size:${F}px;bottom:${bottom.toFixed(2)}px`, bars }
}

/**
 * A slice's bars into its box. A bar drawn as one was – the same text at the same weight – takes that one's span and
 * only moves; the others take the spans left over, or new ones. Text is shaped only for a bar that looks new,
 * however many come and go, so a piece in motion costs what changes.
 */
const fill = (box, bars) => {
  const had = new Map(), fresh = []
  for (const span of box.children) had.has(span.key) ? had.get(span.key).push(span) : had.set(span.key, [span])
  for (const b of bars) {
    const span = had.get(b[1] + b[2])?.pop()
    span ? move(span, b[0]) : fresh.push(b)
  }
  const spare = [...had.values()].flat()
  for (const [x, wght, ch] of fresh) {
    const span = spare.pop() ?? box.appendChild(document.createElement('span'))
    span.key = wght + ch, span.style.setProperty('--wght', wght)
    span.firstChild ? span.firstChild.data = ch : span.append(ch)
    move(span, x)
  }
  for (const span of spare) span.remove()
}
const move = (span, x) => { if (span.x !== x) span.x = x, span.style.left = `${x}px` }

/** Set a traced piece into el, at el's width: a box a slice, a span a bar. */
export function draw(el, piece, width = el.clientWidth) {
  const s = width / piece.w
  if (!s) return
  const ar = `${piece.w} / ${piece.h}`
  if (el.dataset.ar !== ar) el.dataset.ar = el.style.aspectRatio = ar
  const px = 1 / (globalThis.devicePixelRatio || 1), F = size(piece, s, px), slices = piece.slices.filter(sl => sl.lines.some(l => l.length))
  while (el.children.length > slices.length) el.lastChild.remove()
  slices.forEach((slice, i) => {
    const { style, bars } = row(slice, piece.h, s, px, F)
    const box = el.children[i] ?? el.appendChild(Object.assign(document.createElement('div'), { className: 'wf art-line' }))
    if (box.getAttribute('style') !== style) box.setAttribute('style', style)
    fill(box, bars)
  })
}


/* ── motion: each piece as a function of time t (s) and pointer p ({x, y}, 0..1 across it) ───── */

/** One-slice piece of bars, laid into lines of text: each line a run of bars left to right, none starting inside another. */
export const laid = (piece, bars) => {
  const lines = []
  for (const b of bars.sort((a, b) => a[0] - b[0])) {
    const line = lines.find(l => l.at(-4) + l.at(-3) <= b[0])
    line ? line.push(...b) : lines.push([...b])
  }
  return { ...piece, slices: [{ ...piece.slices[0], lines }] }
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/**
 * Piece with slice k moved dx(k) pixels right. A periodic slice wraps: bars from its first period and a half
 * repeat two periods before it, and from its last before that, two after it – so no edge shows as it moves.
 */
const moved = (piece, dx, periodic) => ({
  ...piece,
  slices: piece.slices.map((slice, k) => {
    // the period: the median step between the slice's full-height bars
    const d = dx(k), main = [], first = slice.lines[0] ?? []
    for (let i = 0; i < first.length; i += 4) if (first[i + 3] - first[i + 2] > 0.8 * slice.h) main.push(first[i])
    const steps = main.slice(1).map((x, i) => x - main[i]).sort((a, b) => a - b)
    const P = periodic && steps.length ? steps[steps.length >> 1] : 0
    return {
      ...slice,
      lines: slice.lines.map(line => {
        const bars = []
        for (let i = 0; i < line.length; i += 4) bars.push(line.slice(i, i + 4))
        if (!P) return bars.flatMap(([x, ...b]) => [x + d, ...b])
        // copies stay clear of the line's own bars
        const from = bars[0][0], to = bars.at(-1)[0] + bars.at(-1)[1]
        const head = bars.filter(([x]) => x < main[0] + 1.5 * P).map(([x, ...b]) => [x - 2 * P, ...b]).filter(([x, w]) => x + w <= from)
        const tail = bars.filter(([x]) => x > main.at(-1) - 1.5 * P).map(([x, ...b]) => [x + 2 * P, ...b]).filter(([x]) => x >= to)
        return [...head, ...bars, ...tail].flatMap(([x, ...b]) => [x + d, ...b])
      })
    }
  })
})

// every bar of a one-slice piece, as [x, width, top, bottom]; without the 1 px slivers of antialiasing, as the
// pointer's pieces are moved
const every = (piece, min = 0) => {
  const out = []
  for (const line of piece.slices[0].lines) for (let i = 0; i < line.length; i += 4) if (line[i + 1] > min) out.push(line.slice(i, i + 4))
  return out
}
const wrap = (v, a, b) => ((v - a) % (b - a) + (b - a)) % (b - a) + a
const extent = bs => [Math.min(...bs.map(b => b[2])), Math.max(...bs.map(b => b[3])), Math.min(...bs.map(b => b[0])), Math.max(...bs.map(b => b[0] + b[1]))]
// a set's free ends as a loop over x: values between neighbours, the last running on into the first
const loop = (set, end) => {
  const pts = set.map(b => [b[0] + b[1] / 2, b[end]]).sort((a, b) => a[0] - b[0])
  const x0 = pts[0][0], pitch = (pts.at(-1)[0] - x0) / (pts.length - 1)
  return x => {
    const u = wrap(x - x0, 0, pitch * pts.length) / pitch, i = Math.floor(u), f = u - i
    return pts[i % pts.length][1] * (1 - f) + pts[(i + 1) % pts.length][1] * f
  }
}

export const motion = {
  // floating lines: a wave passes through them, lifting and lowering each
  floating: piece => {
    const bs = every(piece)
    return t => laid(piece, bs.map(([x, w, a, e]) => { const d = 13 * Math.sin(2 * Math.PI * x / 110 - 1.8 * t); return [x, w, a + d, e + d] }))
  },

  // hanging bars and standing bars: two arcs passing through each other
  arcs: piece => {
    const bs = every(piece), [top] = extent(bs), hangs = b => b[2] - top < 2
    const hb = loop(bs.filter(hangs), 3), st = loop(bs.filter(b => !hangs(b)), 2)
    return t => laid(piece, bs.map(([x, w, a, e]) => hangs([x, w, a, e]) ? [x, w, a, hb(x + w / 2 + 14 * t)] : [x, w, st(x + w / 2 - 14 * t), e]))
  },

  // blocks round a middle line: they thump, as a speaker does on the beat
  speaker: piece => {
    const bs = every(piece), [top, floor] = extent(bs), mid = (top + floor) / 2
    return t => { const k = 1 + 0.09 * Math.exp(-5 * (t * 1.4 % 1)); return laid(piece, bs.map(([x, w, a, e]) => [x, w, mid + (a - mid) * k, mid + (e - mid) * k])) }
  },

  // the stripes' three bands slide against each other, the middle one still, as the pointer leans
  stripes: piece => (t, p) => moved(piece, k => (p.x - 0.5) * (k - 1) * 30, true),

  // slide: every other bar hands over from the floor to the ceiling, where the pointer is
  slide: piece => {
    const H = piece.slices[0].h, all = every(piece, 1)
    const full = b => b[2] <= 2 && b[3] >= H - 1
    const walk = all.filter(b => !full(b)).map(([x, w, top, bot]) => [x + w / 2, top, bot])
    // top and bottom of a walking bar at x, from the traced ones; flat past both ends
    const at = x => {
      const i = walk.findIndex(s => s[0] >= x)
      if (i <= 0) return (walk[i] ?? walk.at(-1)).slice(1)
      const [x0, t0, b0] = walk[i - 1], [x1, t1, b1] = walk[i], k = (x - x0) / (x1 - x0)
      return [t0 + (t1 - t0) * k, b0 + (b1 - b0) * k]
    }
    return (t, p) => laid(piece, all.map(b => full(b) ? b : [b[0], b[1], ...at(b[0] + b[1] / 2 - (p.x - 0.5) * 0.9 * piece.w)]))
  },

  // stairs: the white stair between floor and ceiling rides the pointer's height, and bends with its side
  stairs: piece => {
    const H = piece.slices[0].h, all = every(piece, 1)
    const ceiling = all.filter(b => b[2] === 0 && b[3] < H), floor = all.filter(b => b[2] > 0 && b[3] >= H - 3)
    const cols = floor.map(f => [f, ceiling.find(c => c[0] === f[0])]).filter(([, c]) => c)
    const rest = all.filter(b => !cols.some(([f, c]) => b === f || b === c))
    return (t, p) => laid(piece, [...rest, ...cols.flatMap(([[x, w, b], [, , , a]]) => {
      const gap = b - a, top = clamp(a + (p.y - 0.5) * 0.7 * H + (p.x - 0.5) * 0.3 * H * Math.sin(2 * Math.PI * x / piece.w), 0, H - gap), out = []
      if (top >= 1) out.push([x, w, 0, top])
      if (top + gap <= H - 1) out.push([x, w, top + gap, H])
      return out
    })])
  }
}


/* ── a piece in a frame: only the part its bars reach ───── */

/** The box a one-slice piece's bars reach, [x0, y0, x1, y1], over a stretch of its motion if it moves. */
export const reach = (piece, at) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let t = 0; t < 12; t += at ? 0.1 : 12) for (const line of (at ? at(t, { x: 0.5, y: 0.5 }) : piece).slices[0].lines) for (let i = 0; i < line.length; i += 4) {
    x0 = Math.min(x0, line[i]), x1 = Math.max(x1, line[i] + line[i + 1]), y0 = Math.min(y0, line[i + 2]), y1 = Math.max(y1, line[i + 3])
  }
  return [x0, y0, x1, y1]
}

/** A one-slice piece cut to a box, and pad pixels round it where the piece has them. */
export const crop = (piece, [x0, y0, x1, y1], pad = 6) => {
  const s = piece.slices[0]
  x0 = Math.max(0, x0 - pad), y0 = Math.max(0, y0 - pad), x1 = Math.min(piece.w, x1 + pad), y1 = Math.min(s.h, y1 + pad)
  const lines = s.lines.map(line => line.map((v, i) => i % 4 === 0 ? v - x0 : i % 4 > 1 ? v - y0 : v))
  return { ...piece, w: x1 - x0, h: y1 - y0, slices: [{ y: 0, h: y1 - y0, lines }] }
}
