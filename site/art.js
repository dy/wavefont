/**
 * Pictures as text: vertical bars traced from an image, set back in Wavefont as range bars.
 * A piece is horizontal slices; a slice is lines of bars `[x, width, top, bottom, …]` in pixels of the trace.
 * One character a bar, its weight the bar's width, each standing at its own x.
 */
import { bar, char } from '../index.js'

const WIDEST = 0.25 // em: the advance at wght 1000

/**
 * Font size for a piece at scale s: one for all its slices, as each size and weight is a font of its own and
 * engines keep a couple of hundred. It leaves every slice's top below level 127, the highest a bar reaches, so a
 * band meets the one above it with no hairline between; and it lets the widest bar, and a device pixel of seam,
 * be one character.
 */
const size = (piece, s, px) => {
  let F = 0
  for (const slice of piece.slices) for (const line of slice.lines) {
    if (line.length) F = Math.max(F, slice.h * s / 1.265)
    for (let i = 1; i < line.length; i += 4) F = Math.max(F, (line[i] * s + px) / WIDEST)
  }
  return +F.toFixed(3)
}

/**
 * Line box of `line-height: 1.28` spans levels 0 to 128 exactly (level L sits 10L − 140 units above the baseline),
 * so a slice's box of font size F with its bottom on the slice bottom puts level L at L·F/100 px above it.
 * Each bar stands at its own x, on a device pixel (px, in CSS px), rather than where the bars before it carry the pen:
 * engines round every run of text their own way – Blink up to 1/64 px, Firefox to whole font units – and along
 * a line of spans the roundings add up, until touching bars part.
 * Returns the slice's style and its bars, each [x, wght, char].
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
    const ch = bar(Math.floor(level(bottom)), Math.ceil(level(top)))
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
 * A slice's bars into its box. A bar drawn as one was – the same character at the same weight – takes that one's
 * span and only moves; the others take the spans left over, or new ones. Text is shaped only for a bar that looks
 * new, however many come and go, so a piece in motion costs what changes.
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

/**
 * Bands of equal bars, measured from a scan: [top, bottom, bar width, pitch, first bar x], as a traced piece.
 * With shift, band k slides by shift[k] pixels: the same number of bars, from just before the left edge
 * to past the right, the bars it pushes past one edge coming back at the other.
 */
export const banded = ({ w, h, bands }, shift) => ({
  w, h,
  slices: bands.map(([top, bottom, bw, pitch, x0], k) => {
    const line = []
    if (shift) for (let i = 0, x = ((x0 + shift[k]) % pitch + pitch) % pitch - pitch, n = Math.ceil(w / pitch) + 2; i < n; i++) line.push(x + i * pitch, bw, 0, bottom - top)
    else for (let x = x0; x + bw <= w + 1; x += pitch) line.push(Math.round(x), bw, 0, bottom - top)
    return { y: top, h: bottom - top, lines: [line] }
  })
})

/**
 * Bars standing on a circle, one per spoke, clockwise from the top: SVG text on a circular path.
 * Spoke thickness is given in degrees at radius 41 of the 800 px source; weights follow.
 */
export function ring({ inner, outer, size, spokes }) {
  const n = spokes.length, pitch = 2 * Math.PI * inner / n
  const widths = spokes.map(deg => deg * Math.PI / 180 * 41)
  // the widest spoke must fit in wght 1000 (0.25em); a bar of value v reaches v% of the font size outward
  const F = Math.max(outer - inner, Math.max(...widths) / WIDEST), v = (outer - inner) / F * 100
  // start half a pitch before the top so spoke k is centred on k pitches clockwise
  const a0 = -Math.PI / 2 - Math.PI / n, c = size / 2
  const at = a => `${(c + inner * Math.cos(a)).toFixed(2)},${(c + inner * Math.sin(a)).toFixed(2)}`
  const d = `M${at(a0)}A${inner},${inner} 0 1,1 ${at(a0 + Math.PI)}A${inner},${inner} 0 1,1 ${at(a0)}`
  const tspans = widths.map((w, k) => {
    const next = widths[k + 1] ?? widths[0], ls = pitch - (w + next) / 2
    return `<tspan style="--wght:${(w / F * 4000).toFixed(1)};letter-spacing:${ls.toFixed(3)}px">${char(v)}</tspan>`
  }).join('')
  const id = 'ring' + Math.random().toString(36).slice(2, 8)
  return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><path id="${id}" fill="none" d="${d}"/>`
    + `<text class="wf" style="font-size:${F}px;--yela:-100"><textPath href="#${id}" startOffset="${(pitch / 2 - widths[0] / 2).toFixed(3)}">${tspans}</textPath></text></svg>`
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

/** Bars of a one-slice piece as [x, width, top, bottom], lines merged, 1 px slivers of antialiasing left out. */
const barsOf = piece => {
  const out = []
  for (const line of piece.slices[0].lines) for (let i = 0; i < line.length; i += 4) if (line[i + 1] > 1) out.push(line.slice(i, i + 4))
  return out
}

/**
 * A lens under the pointer, as strong as p.k (0 at rest, 1 in hand): the bars it passes over widen about their
 * middles, up to 3.2 times, and may run into their neighbours – each bar is placed on its own, so that's fine.
 */
const widen = piece => {
  const R = 0.16 * piece.w
  return (t, p) => {
    const px = p.x * piece.w, py = p.y * piece.h, k = p.k ?? 1
    if (!k) return piece
    return {
      ...piece,
      slices: piece.slices.map(slice => ({
        ...slice,
        lines: slice.lines.map(line => {
          const out = []
          for (let i = 0; i < line.length; i += 4) {
            const [x, w, top, bot] = line.slice(i, i + 4), dx = x + w / 2 - px, dy = Math.max(0, slice.y + top - py, py - slice.y - bot)
            const f = 1 + 2.2 * k * Math.exp(-(dx * dx + dy * dy) / (R * R))
            out.push(x + w / 2 - w * f / 2, w * f, top, bot)
          }
          return out
        })
      }))
    }
  }
}

/**
 * Bars cut in two: where an upper part stands over a lower one, overlapping it across, the cut between them rides the
 * pointer's height – the upper part's foot and the lower part's head move together, their outer ends stay.
 */
const cut = piece => {
  const all = every(piece), H = piece.slices[0].h, pairs = [], taken = new Set()
  const across = (a, b) => Math.min(a[0] + a[1], b[0] + b[1]) - Math.max(a[0], b[0]) > 0.5 * Math.min(a[1], b[1])
  for (const u of all) {
    if (taken.has(u)) continue
    const l = all.filter(b => b !== u && !taken.has(b) && b[2] >= u[3] && across(u, b)).sort((a, b) => a[2] - b[2])[0]
    if (l) pairs.push([u, l]), taken.add(u), taken.add(l)
  }
  const rest = all.filter(b => !taken.has(b))
  return (t, p) => laid(piece, [...rest, ...pairs.flatMap(([u, l]) => {
    const d = clamp((p.y - 0.5) * 0.6 * H, u[2] + 1 - u[3], l[3] - 1 - l[2])
    return [[u[0], u[1], u[2], u[3] + d], [l[0], l[1], l[2] + d, l[3]]]
  })])
}

/**
 * Bars with stepped tops, each of parts side by side on one foot: the steps below a bar's top rise and fall with the
 * pointer's height, within the bar.
 */
const steps = piece => {
  const all = every(piece).sort((a, b) => a[0] - b[0]), bars = []
  for (const b of all) {
    const last = bars.at(-1)?.at(-1)
    last && b[0] - (last[0] + last[1]) < 0.6 && Math.abs(b[3] - last[3]) < 1 ? bars.at(-1).push(b) : bars.push([b])
  }
  const H = piece.slices[0].h
  return (t, p) => laid(piece, bars.flatMap(parts => {
    const top = Math.min(...parts.map(b => b[2])), d = (p.y - 0.5) * 0.5 * H
    return parts.map(([x, w, a, e]) => a === top ? [x, w, a, e] : [x, w, clamp(a + d, top, e - 1), e])
  }))
}

export const motion = {
  // the op-art pieces: a lens over the circle's, the lens', the comb's and the wedge's bars; the descent's cut and the
  // globe's steps follow the pointer's height; the stripes' three bands slide against each other; the blocks rise and
  // fall as a wave passes
  circle: widen,
  lens: widen,
  comb: widen,
  wedge: widen,
  descent: cut,
  globe: steps,
  stripes: piece => (t, p) => moved(piece, k => (p.x - 0.5) * (k - 1) * 30, true),
  blocks: piece => {
    const bs = every(piece), H = piece.slices[0].h
    return (t, p) => laid(piece, bs.map(([x, w, a, e]) => {
      const d = clamp((p.k ?? 1) * 0.1 * H * Math.sin(2 * Math.PI * 1.5 * x / piece.w - 2.4 * t), -a, H - e)
      return [x, w, a + d, e + d]
    }))
  },

  // bands slide against each other, alternate ways: the moiré follows the pointer
  bands: spec => (t, p) => banded(spec, spec.bands.map((_, k) => (k % 2 ? 1 : -1) * (p.x - 0.5) * 0.24 * spec.w)),

  // steps: the four bands slide apart as the pointer moves off the middle, and line up at it; each band its
  // full-height bars only – the trace's slivers at the joins would hang off them as they move
  steps: piece => {
    const bands = { ...piece, slices: piece.slices.map(sl => ({ ...sl, lines: sl.lines.map(line => {
      const out = []
      for (let i = 0; i < line.length; i += 4) if (line[i + 3] - line[i + 2] > 0.8 * sl.h) out.push(line[i], line[i + 1], 0, sl.h)
      return out
    }).filter(l => l.length) })) }
    return (t, p) => moved(bands, k => (p.x - 0.5) * (k - 1.5) * 16, true)
  },

  // checker: rows shear in proportion to their height, as the pointer leans
  checker: piece => (t, p) => moved(piece, k => (p.x - 0.5) * (k - piece.slices.length / 2) * 7 + 2 * Math.sin(1.3 * t + 0.5 * k)),

  // slide: every other bar hands over from the floor to the ceiling, where the pointer is
  slide: piece => {
    const H = piece.slices[0].h, all = barsOf(piece)
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
    const H = piece.slices[0].h, all = barsOf(piece)
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


/* ── the article's nine in motion: each moves the way its picture suggests; t in seconds ───── */

// every bar of a one-slice piece, as [x, width, top, bottom]
const every = piece => {
  const out = []
  for (const line of piece.slices[0].lines) for (let i = 0; i < line.length; i += 4) out.push(line.slice(i, i + 4))
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

export const tileMotion = [
  // a bar chart: bars rise and fall, each at its own pace
  piece => {
    const bs = every(piece)
    return t => laid(piece, bs.map(([x, w, top, bot], i) => [x, w, bot - (bot - top) * (0.74 + 0.26 * Math.sin(t * (1.1 + i * 0.37 % 0.9) + i * 2.1)), bot]))
  },
  // hanging bars and standing bars: two arcs passing through each other
  piece => {
    const bs = every(piece), [top] = extent(bs), hangs = b => b[2] - top < 2
    const hb = loop(bs.filter(hangs), 3), st = loop(bs.filter(b => !hangs(b)), 2)
    return t => laid(piece, bs.map(([x, w, a, e]) => hangs([x, w, a, e]) ? [x, w, a, hb(x + w / 2 + 14 * t)] : [x, w, st(x + w / 2 - 14 * t), e]))
  },
  // tracks and faders: each fader's bar moves up and down its track
  piece => {
    const bs = every(piece), [top, floor] = extent(bs)
    const tracks = bs.filter(b => b[2] - top < 2 && floor - b[3] < 2)
    const near = b => tracks.reduce((k, l, i) => Math.abs(l[0] - b[0]) < Math.abs(tracks[k][0] - b[0]) ? i : k, 0)
    return t => laid(piece, bs.map(b => {
      if (tracks.includes(b)) return b
      const [x, w, a, e] = b, k = near(b), h = (e - a) * (0.78 + 0.32 * Math.sin(t * (1.3 + k % 3 * 0.35) + k * 1.3))
      return [x, w, Math.max(top + 2, e - h), e]
    }))
  },
  // candlesticks: the chart runs left, the oldest dropping off as new ones come in
  piece => {
    const bs = every(piece), [, , x0, x1] = extent(bs), span = (x1 - x0) * 1.15
    return t => laid(piece, bs.map(([x, w, a, e]) => [wrap(x - 9 * t, x0, x0 + span), w, a, e]).filter(([x, w]) => x + w <= x1))
  },
  // floating lines: a wave passes through them, lifting and lowering each
  piece => {
    const bs = every(piece)
    return t => laid(piece, bs.map(([x, w, a, e]) => { const d = 13 * Math.sin(2 * Math.PI * x / 110 - 1.8 * t); return [x, w, a + d, e + d] }))
  },
  // three rows of bars, finer above, some running through all three: a wave runs along each row, pressing its bars
  // down as keys are and letting them up, every row keeping to its own band
  piece => {
    // the rows' edges: the bars' tops and bottoms, a pixel or two apart counting as one
    const bs = every(piece), edges = [...new Set(bs.flatMap(b => [b[2], b[3]]).map(Math.round))].sort((a, b) => a - b)
    const rows = edges.filter((e, i) => !i || e - edges[i - 1] > 2)
    const parts = bs.flatMap(([x, w, a, e]) => rows.slice(1).map((end, k) => [x, w, Math.max(a, rows[k]), Math.min(e, end), k]).filter(p => p[3] - p[2] > 2))
    return t => laid(piece, parts.map(([x, w, a, e, k]) => {
      const press = Math.max(0, Math.sin(2 * Math.PI * (x / 120 - 0.35 * t) - k * 0.9)) ** 6
      return [x, w, a + (e - a) * 0.55 * press, e]
    }))
  },
  // blocks round a middle line: they thump, as a speaker does on the beat
  piece => {
    const bs = every(piece), [top, floor] = extent(bs), mid = (top + floor) / 2
    return t => { const k = 1 + 0.09 * Math.exp(-5 * (t * 1.4 % 1)); return laid(piece, bs.map(([x, w, a, e]) => [x, w, mid + (a - mid) * k, mid + (e - mid) * k])) }
  }
]


/* ── a piece in a tile: only the part its bars reach ───── */

/** The box a one-slice piece's bars reach, [x0, y0, x1, y1], over a stretch of its motion if it moves. */
export const reach = (piece, at) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let t = 0; t < 12; t += at ? 0.1 : 12) for (const line of (at ? at(t) : piece).slices[0].lines) for (let i = 0; i < line.length; i += 4) {
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
