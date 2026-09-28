/**
 * A bird between pipes, every one a character: a bar hanging from the ceiling, or lifted to stand on the floor, and
 * the bird a short bar lifted to its height. The pipes keep their pitch and come heavier one after another – the
 * weight axis is the difficulty – till from the hundredth they touch, a cave, its gap shifting pipe to pipe. The
 * 108th is the last; past it the world goes on, the bird flies free, and ॐ comes in.
 */
import wf from '../index.js'
import { range, lead } from './shifts.js'
import { fit, weight } from './wave.js'
import { om } from './data.js'
import { $, $$, h, seen, noise, still, ease, dpx } from './dom.js'

const clamp = (x, a, b) => Math.min(b, Math.max(a, x))

// the bird in the BIRD-th column, half a column wide and H steps high; a pipe every EVERY columns; the world goes by
// SPEED columns a second, the bird falls at FALL steps a second squared, a flap sends it up at FLAP; WIN pipes win
export const BIRD = 8, H = 5, EVERY = 5, SPEED = 5, FALL = 170, FLAP = 55, WIN = 108
// how far a course's step leans toward where it heads, steps
const PULL = 1.5

// how far on pipe j is, 0 to 1: the pipes close in over the first hundred
const on = j => Math.min(1, j / 100)
/** How much of its pitch pipe j fills: a hairline first, each after it heavier, the whole pitch from the hundredth. */
export const fill = j => .02 + .98 * (1 - (1 - on(j)) ** 2)
/** Pipe j's gap, steps high: 40 to begin with, 26 from the hundredth – the bird, a flap's rise, and room to shift. */
export const size = j => 40 - 14 * on(j)

/**
 * How far pipe k + 1's gap may be from pipe k's: as far as the bird climbs or falls in the room between the pipes, and
 * as the two gaps overlap by more than a flap's rise – so, from the hundredth, a shift of up to seven.
 */
export const reach = k => { const f = fill(k); return Math.max(2, Math.min(24, Math.min(size(k), size(k + 1)) - H - 10 - 4 * f + 20 * (1 - f) ** 2)) }

/**
 * A course: pipe j's gap, its middle in steps – anywhere in the field to begin with, then a walk that steps less as
 * the pipes and their gaps leave less room to climb or fall in, turned back at the field's edges. It heads for a
 * height picked by chance, and once there for another: each step, drawn within reach, leans PULL steps toward it –
 * nothing beside the wide steps early on, a heading among the cave's shorter ones. With no lean the steps cancel out,
 * and the cave sits where it began; leaning, it climbs and dives to the end.
 */
export const course = r => {
  const gaps = []
  let aim
  return j => {
    for (let k = gaps.length; k <= j; k++) {
      const lo = size(k) / 2 + 4, hi = 100 - lo
      if (!k) { gaps.push(lo + (hi - lo) * r()), aim = lo + (hi - lo) * r(); continue }
      const m = reach(k - 1), was = gaps[k - 1]
      if (Math.abs(aim - was) <= m) aim = lo + (hi - lo) * r()
      const g = was + clamp((2 * r() - 1) * m + PULL * Math.sign(aim - was), -m, m)
      gaps.push(g > hi ? 2 * hi - g : g < lo ? 2 * lo - g : g)
    }
    return gaps[j]
  }
}

/** A round from column x: the bird mid-air, the first pipe sixteen columns ahead of it, the course new. */
export const round = (r, x = 0) => ({ x, y: 55, vy: 0, from: x + BIRD + 16, gap: course(r), pts: 0, over: false, won: false })

/** Pipe j's edges, in columns of the world. */
const left = (s, j) => s.from + j * EVERY, right = (s, j) => s.from + (j + fill(j)) * EVERY
// the height a bird's middle has in pipe j's gap, either side of the gap's middle
const room = j => (size(j) - H) / 2

/** The pipes across columns a to b of the world. */
export const across = (s, a, b) => {
  const out = []
  for (let j = Math.max(0, Math.floor((a - s.from) / EVERY)); left(s, j) < b; j++) if (right(s, j) > a) out.push(j)
  return out
}

/** The first pipe that ends past column c: the pipes before it are behind. */
const next = (s, c) => { const j = Math.floor((c - s.from) / EVERY); return j < 0 ? 0 : j + (right(s, j) <= c) }

/** Whether the bird at height y, its column at a, meets the floor, the ceiling or a pipe outside its gap. */
const hits = (s, y, a) => y < H / 2 || y > 100 - H / 2 || across(s, a, a + .5).some(j => Math.abs(y - s.gap(j)) > room(j))

/** dt seconds on, after a flap if asked: the world moves, the bird falls or rises; a hit ends the round, and so does
 * the last pipe behind it. The pipes behind the bird count. Won, the world goes on, and the bird, free, rises away. */
export const step = (s, dt, flap) => {
  if (s.won) return s.x += SPEED * dt, s.vy += FALL * dt, s.y += s.vy * dt, s
  if (s.over) return s
  if (flap) s.vy = FLAP
  s.x += SPEED * dt, s.vy -= FALL * dt, s.y += s.vy * dt
  s.pts = Math.min(WIN, next(s, s.x + BIRD)), s.won = s.pts === WIN, s.over = s.won || hits(s, s.y, s.x + BIRD)
  return s
}

// a flap's rise, s: as far ahead as the pilot aims
const RISE = FLAP / FALL

/**
 * Flying itself, dt seconds on: a flap if without one that step would hit something and with one it wouldn't; else
 * whenever it's falling under
 * its aim – the middle of the gap a flap's rise ahead, as near as the gaps before it allow, the nearest most – unless
 * the flap would take it into a pipe before it's down again.
 */
export const pilot = (s, dt) => {
  if (s.vy >= 0) return false
  const a = s.x + BIRD, ahead = SPEED * RISE
  const then = vy => s.y + (vy - FALL * dt) * dt
  if (hits(s, then(s.vy), a + SPEED * dt)) return !hits(s, then(FLAP), a + SPEED * dt)
  const aim = across(s, a, a + .5 + ahead).reduceRight((t, j) => clamp(t, s.gap(j) - room(j) + 5, s.gap(j) + room(j) - 6), s.gap(next(s, a + ahead)))
  return s.y < aim - 4 && across(s, a, a + .5 + 2 * ahead).every(j => s.y + FLAP * RISE / 2 + 1 < s.gap(j) + room(j))
}

/* ── the prize: ॐ as op art draws it, past the last pipe – stripes the field's height swelling into the glyph, each
   a line of bars set vertically, as Japanese is, every bar turned on its side: its height the stripe's width there ── */

// stripes across the glyph, and before it; a stripe's width, hundredths of its pitch: THIN clear of the glyph, THICK
// within it; the font size, pitches, so a bar – the widest a quarter of it – may be as wide as half a pitch
const LINES = 36, LEAD = 3, THIN = 14, THICK = 86, SIZE = 2

/**
 * The prize in a field w × h px, px a device pixel: the glyph four fifths of the field high at most, and as much of its
 * width; LINES stripes to the glyph's width, p whole device pixels apart, set at SIZE pitches, F; bars down each a
 * pixel short of the widest a bar comes, a quarter of F, so that a pixel over they meet without a seam. The stripes
 * start LEAD pitches before the glyph and run on to the field's right edge once the glyph stands in its middle: S of
 * them, M bars down each, the glyph gx, gy from their top left.
 */
export const layout = (w, h, px) => {
  const k = Math.min(.8 * h / om.h, .84 * w / om.w), gw = om.w * k, gh = om.h * k
  const p = Math.max(4 * px, Math.round(gw / LINES / px) * px), F = SIZE * p, a = Math.max(px, Math.floor((F / 4 - px) / px) * px), gx = LEAD * p
  return { k, p, F, a, S: Math.ceil((w / 2 + gw / 2 + gx) / p), M: Math.ceil(h / a), gx, gy: (h - gh) / 2, gw, gh }
}

/**
 * Every bar's width across its stripe, hundredths of the pitch, stripe after stripe from the left, each from its top.
 * cover[r * S + i] is how much of stripe i's cell r, a pitch wide and a bar long, the glyph covers; that, softened
 * along the stripe over about a pitch, so a stripe swells into the glyph and thins out of it, a lens, not a step.
 */
export const widths = (cover, S, M, p, a) => {
  const R = Math.max(1, Math.round(.8 * p / a)), out = new Float32Array(S * M)
  for (let i = 0; i < S; i++) for (let r = 0; r < M; r++) {
    let t = 0, n = 0
    for (let q = Math.max(-r, -R); q <= Math.min(R, M - 1 - r); q++) t += (R + 1 - Math.abs(q)) * cover[(r + q) * S + i], n += R + 1 - Math.abs(q)
    out[i * M + r] = THIN + (THICK - THIN) * t / n
  }
  return out
}

// the bars grow from the glyph's middle out, the farthest BLOOM ms after the middle, each over GROW ms; then it glows
// for as long as it's there, every bar GLOW bolder and thinner by turns, BREATH ms a breath, the swell spreading from
// the middle out
const BLOOM = 1400, GROW = 700, GLOW = .15, BREATH = 2800

/** A bar t ms into the prize, v wide once grown, starting to grow at `from`: nothing before, then growing, glowing. */
export const grown = (v, from, t) => v * ease(clamp((t - from) / GROW, 0, 1)) * (1 + GLOW * Math.sin(2 * Math.PI * t / BREATH - Math.PI * from / BLOOM))

export function flappy() {
  const sec = $('#game'), box = $('.bars', sec), [low, high, bird] = $$('.line', box), score = $('.score', box), r = noise(21)
  const end = $('.end', box), stripes = $('.om', end), link = $('.prize', end)
  let s = round(r), best = 0, N = 0, P = 0, F = 0, shown = '', hand = -1e9, ended = 0, played = false, inView = false, raf = 0, last = 0
  // the prize once won: the column of the world it starts at, the one the world stops at, its stripes and bars, every
  // bar's width and when it starts to grow, since when
  let prize = null

  const draw = () => {
    // the pipes in view, a span each: as heavy as its share of the pitch and a margin to the next – from the hundredth,
    // a pixel over it, so pipes that touch show no seam; the lines slide by to where the first of them is
    const j0 = Math.max(0, Math.floor((s.x - s.from) / EVERY)), j1 = Math.max(j0, Math.min(WIN, Math.ceil((s.x + N - s.from) / EVERY))), key = `${j0} ${j1} ${P} ${s.from}`
    if (key !== shown) {
      shown = key
      for (const [line, top] of [[high, true], [low, false]]) line.replaceChildren(...Array.from({ length: j1 - j0 }, (_, k) => {
        const j = j0 + k, g = s.gap(j), w = weight(fill(j) * EVERY * P + (fill(j) === 1), F)
        const el = h('span', { textContent: lead(top ? range(Math.round(g + size(j) / 2), 100) : range(0, Math.round(g - size(j) / 2))) })
        el.style.setProperty('--wght', w), Object.assign(el.style, { letterSpacing: 0, marginRight: `${(EVERY * P - w * F / 4000).toFixed(4)}px` })
        return el
      }))
    }
    for (const line of [low, high]) line.style.translate = `${(s.from + j0 * EVERY - s.x) * P}px 0`
    // the bird till it's flown out of the top; the prize where the world has it
    bird.textContent = s.y - H / 2 < 100 ? ' '.repeat(BIRD) + range(Math.round(s.y - H / 2), Math.round(s.y + H / 2)) : ''
    if (prize) end.style.translate = `${(prize.c0 - s.x) * P}px 0`
  }

  // the prize laid out for the field as it is now, from the last pipe on: the glyph drawn a cell a pixel, as much of
  // each as it covers; the stripes set, the link over the glyph; the world to stop with the glyph in its middle
  const crown = (c0 = s.from + WIN * EVERY) => {
    const fw = box.clientWidth, fh = box.clientHeight, px = dpx(), L = layout(fw, fh, px), { S, M, p, F, a } = L
    const c = h('canvas', { width: S, height: M }), x = c.getContext('2d', { willReadFrequently: true })
    x.setTransform(L.k / p, 0, 0, L.k / a, L.gx / p, L.gy / a), x.fill(new Path2D(om.d))
    const ink = x.getImageData(0, 0, S, M).data, cover = new Float32Array(S * M)
    for (let q = 0; q < cover.length; q++) cover[q] = ink[4 * q + 3] / 255
    // each bar starts to grow as much later than the glyph's middle as it is farther from it
    const mx = L.gx + L.gw / 2, my = fh / 2, far = Math.hypot(Math.max(mx, S * p - mx), my), from = new Float32Array(S * M)
    for (let i = 0; i < S; i++) for (let m = 0; m < M; m++) from[i * M + m] = BLOOM * Math.hypot((i + .5) * p - mx, (m + .5) * a - my) / far
    // lines a pitch apart, their font SIZE pitches, so a bar's height is hundredths of it, a SIZE-th of the pitch's
    const wght = weight(a + px, F)
    Object.assign(stripes.style, { fontSize: `${F}px`, lineHeight: `${p}px`, letterSpacing: `${(a - wght * F / 4000).toFixed(4)}px` })
    stripes.style.setProperty('--wght', wght)
    Object.assign(link.style, { left: `${L.gx}px`, top: `${L.gy}px`, width: `${L.gw}px`, height: `${L.gh}px` })
    end.hidden = false
    return { c0, stop: c0 + (L.gx + L.gw / 2) / P - N / 2, S, M, v: widths(cover, S, M, p, a).map(v => v / SIZE), from }
  }
  // the stripes as grown by now, glowing – grown, twenty times a second: a breath is slow, and a paint of every bar
  // dear; with less motion asked for, grown and still, once
  const paint = now => {
    if (still ? prize.done : now - prize.t0 > BLOOM + GROW && now - prize.at < 50) return
    const { S, M, v, from, t0 } = prize, t = now - t0, line = new Float32Array(M), lines = []
    for (let i = 0; i < S; i++) {
      for (let m = 0; m < M; m++) line[m] = still ? v[i * M + m] : grown(v[i * M + m], from[i * M + m], t)
      lines.push(wf(line))
    }
    stripes.textContent = lines.join('\n'), prize.done = true, prize.at = now
  }

  // the view forty columns wide at least – more on a wide screen, so the widest pipe, a pitch, stays within a bar's
  // widest, a quarter of the height; the prize laid out anew, as grown as it was
  new ResizeObserver(() => {
    F = parseFloat(getComputedStyle(bird).fontSize), N = Math.max(40, Math.ceil(20 * box.clientWidth / F))
    P = fit(bird, N, .5)
    if (prize) prize = { ...crown(prize.c0), t0: prize.t0 }, paint(performance.now())
    draw()
  }).observe(box)

  const frame = now => {
    const dt = Math.min(.05, (now - last) / 1000)
    last = now
    // a crash holds a moment, its count shown, then a new round. A win: the world goes on till ॐ stands in the middle,
    // the bird flies away, and ॐ glows till a hand plays again. Idle four seconds, the bird flies itself
    if (s.won) step(s, dt), s.x = Math.min(s.x, prize.stop), paint(now)
    else if (s.over) { if (now - ended > 1400) s = round(r, s.x), score.textContent = '' }
    else if (step(s, dt, now - hand > 4000 && pilot(s, dt)).over) {
      ended = now
      if (s.won) prize = { ...crown(), t0: now }
      else best = Math.max(best, s.pts), score.textContent = best > s.pts ? `${s.pts} · best ${best}` : `${s.pts}`
    }
    draw(), raf = requestAnimationFrame(frame)
  }
  // it plays while in view – with less motion asked for, once a hand has started it
  const run = () => { cancelAnimationFrame(raf), raf = 0; if (inView && (!still || played)) last = performance.now(), raf = requestAnimationFrame(frame) }
  // a press on the glyph is the link's; anywhere else, after a win, it plays again
  const go = e => {
    if (e?.target.closest('.prize')) return
    hand = performance.now(), played = true
    if (s.won) prize = null, end.hidden = true, stripes.textContent = '', s = round(r, s.x)
    if (!s.over) s.vy = FLAP
    if (!raf) run()
  }
  box.addEventListener('pointerdown', go)
  box.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault(), go() })
  seen(sec, v => { inView = v, run() }, .35)
}
