/**
 * Pictures as text: vertical bars traced from an image, set back in Wavefont as range bars.
 * A piece is horizontal slices; a slice is lines of bars `[x, width, top, bottom, …]` in pixels of the trace.
 * Each line is one line of text: a bar's weight is its width, its letter-spacing the gap to the next bar.
 */
import { bar, char } from '../index.js'

const WIDEST = 0.25 // em: the advance at wght 1000
const SEAM = 0.4    // px: touching bars overlap by this much, so no hairline shows between them

/**
 * Line box of `line-height: 1.28` spans levels 0 to 128 exactly (level L sits 10L − 140 units above the baseline),
 * so a line of font size F with its box bottom on the slice bottom puts level L at L·F/100 px above it.
 * Bar edges land on device pixels (px, in CSS px): two bars of one width draw alike, wherever they are.
 * Returns the line's style and its spans, each [style, char].
 */
const row = (line, slice, pieceH, s, px) => {
  let widest = 0
  for (let i = 1; i < line.length; i += 4) widest = Math.max(widest, line[i])
  const F = +Math.max(slice.h * s / 1.27, (widest * s + SEAM) / WIDEST).toFixed(3)
  const level = y => (slice.h - y) * s / F * 100
  const edge = x => Math.round(x * s / px) * px
  const parts = []
  for (let i = 0; i < line.length; i += 4) {
    const a = edge(line[i]), b = Math.max(a + px, edge(line[i] + line[i + 1]))
    const ch = bar(Math.floor(level(line[i + 3])), Math.ceil(level(line[i + 2])))
    const k = Math.ceil((b - a + SEAM) / (WIDEST * F))
    for (let j = 0; j < k; j++) parts.push([a + (b - a) * j / k, (b - a) / k, ch, j < k - 1])
  }
  // each span advances by its weight, and letter-spacing takes the pen to the next start exactly
  const spans = parts.map(([x, w, ch, joined], i) => {
    const next = parts[i + 1]?.[0] ?? x + w
    const wide = w + (joined || next - x - w < px ? SEAM : 0) // touching bars overlap a little: no hairline between
    const wght = +Math.min(1000, Math.max(4, wide / F * 4000)).toFixed(1)
    return [`--wght:${wght};letter-spacing:${(next - x - wght * F / 4000).toFixed(4)}px`, ch]
  })
  const bottom = (pieceH - slice.y - slice.h) * s
  return { style: `font-size:${F}px;bottom:${bottom.toFixed(2)}px;left:${parts[0][0].toFixed(4)}px`, spans }
}

/**
 * Set a traced piece into el, at el's width. Drawn again with the same lines of the same number of bars,
 * only the styles and characters that changed are touched – so a piece in motion costs what moves.
 */
export function draw(el, piece, width = el.clientWidth) {
  const s = width / piece.w
  if (!s) return
  const ar = `${piece.w} / ${piece.h}`
  if (el.dataset.ar !== ar) el.dataset.ar = el.style.aspectRatio = ar
  const rows = [], px = 1 / (globalThis.devicePixelRatio || 1)
  for (const slice of piece.slices) for (const line of slice.lines) if (line.length) rows.push(row(line, slice, piece.h, s, px))
  const kids = el.children
  if (kids.length === rows.length && rows.every((r, i) => kids[i].children.length === r.spans.length)) {
    rows.forEach((r, i) => {
      const div = kids[i]
      if (div.getAttribute('style') !== r.style) div.setAttribute('style', r.style)
      r.spans.forEach(([style, ch], j) => {
        const span = div.children[j]
        if (span.getAttribute('style') !== style) span.setAttribute('style', style)
        if (span.firstChild.data !== ch) span.firstChild.data = ch
      })
    })
    return
  }
  el.innerHTML = rows.map(r => `<div class="wf art-line" style="${r.style}">${r.spans.map(([style, ch]) => `<span style="${style}">${ch}</span>`).join('')}</div>`).join('')
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
/** One-slice piece of bars, laid into lines of text: each line a run of bars left to right, none starting inside another. */
const laid = (piece, bars) => {
  const lines = []
  for (const b of bars.sort((a, b) => a[0] - b[0])) {
    const line = lines.find(l => l.at(-4) + l.at(-3) <= b[0])
    line ? line.push(...b) : lines.push([...b])
  }
  return { ...piece, slices: [{ ...piece.slices[0], lines }] }
}

export const motion = {
  // bands slide against each other, alternate ways: the moiré follows the pointer
  bands: spec => (t, p) => banded(spec, spec.bands.map((_, k) => (k % 2 ? 1 : -1) * (p.x - 0.5) * 0.24 * spec.w)),

  // steps: the four bands slide apart as the pointer moves off the middle, and line up at it
  steps: piece => (t, p) => moved(piece, k => (p.x - 0.5) * (k - 1.5) * 16, true),

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
  },

  // figure: a lens under the pointer widens the bars it passes over, about their middles; widened bars
  // may run into their neighbours, which text draws over each other, so the lines stay as traced
  figure: piece => {
    const R = 0.13 * piece.w
    return (t, p) => {
      const px = p.x * piece.w, py = p.y * piece.h
      return {
        ...piece,
        slices: piece.slices.map(slice => ({
          ...slice,
          lines: slice.lines.map(line => {
            const out = []
            for (let i = 0; i < line.length; i += 4) {
              const [x, w, top, bot] = line.slice(i, i + 4), dx = x + w / 2 - px, dy = Math.max(0, slice.y + top - py, py - slice.y - bot)
              const k = 1 + 2.2 * Math.exp(-(dx * dx + dy * dy) / (R * R))
              out.push(x + w / 2 - w * k / 2, w * k, top, bot)
            }
            return out
          })
        }))
      }
    }
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
  // three rows of bars, each running at its own speed, round like a belt
  piece => {
    const rows = []
    for (const b of every(piece)) {
      const r = rows.find(r => Math.abs(r[0][2] - b[2]) < 4 && Math.abs(r[0][3] - b[3]) < 4)
      r ? r.push(b) : rows.push([b])
    }
    const belts = rows.map((r, k) => {
      const xs = r.map(b => b[0]).sort((a, b) => a - b), steps = xs.slice(1).map((x, i) => x - xs[i]).sort((a, b) => a - b)
      const pitch = steps[steps.length >> 1] || 1
      return { r, x0: xs[0], span: pitch * Math.round((xs.at(-1) - xs[0]) / pitch + 1), v: [11, -7, 4][k % 3] }
    })
    return t => laid(piece, belts.flatMap(({ r, x0, span, v }) => r.map(([x, w, a, e]) => [wrap(x + v * t, x0, x0 + span), w, a, e])).filter(([x, w]) => x + w <= piece.w))
  },
  // blocks round a middle line: they thump, as a speaker does on the beat
  piece => {
    const bs = every(piece), [top, floor] = extent(bs), mid = (top + floor) / 2
    return t => { const k = 1 + 0.09 * Math.exp(-5 * (t * 1.4 % 1)); return laid(piece, bs.map(([x, w, a, e]) => [x, w, mid + (a - mid) * k, mid + (e - mid) * k])) }
  }
]
