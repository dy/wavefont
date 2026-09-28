/**
 * Vertical shifts: marks after a bar move it – U+0301 a step up, U+0302 ten, U+0300 and U+030C as far down – so a
 * bar stands anywhere: from one value to another, at a height, either side of a line. The slide: two waves in one
 * line of characters, every bar of its own height, lift, width and roundness – press one to read it, drag it to move.
 */
import { char, shift } from '../index.js'
import { weight } from './wave.js'
import { $, h, copyable, swing, still, seen } from './dom.js'

const clamp = (x, a, b) => Math.min(b, Math.max(a, x))

/** A bar from step lo to step hi over the floor, as text: the value hi − lo lifted lo steps – lowered, lo under 0; none, a space. */
export const range = (lo, hi) => hi > lo ? char(hi - lo) + shift(lo) : ' '

/**
 * Text for a run of its own – a span with its own weight, say – that may start with a moved bar. WebKit (Core Text)
 * moves a whole run whose first glyph the font moves, and twice as far the wrong way; a mark before the bar keeps it
 * still: the font's marks draw nothing, take no room and, with no bar before them, move nothing. It takes a run's
 * letter-spacing in Chromium and Firefox, not in WebKit: such runs are spaced by margins.
 */
export const lead = t => '\u0301' + t

const hex = c => 'U+' + c.toString(16).toUpperCase().padStart(4, '0')
/** A bar's characters, a run of one mark as its count: 'U+0120 U+0302 ×2 U+0301 ×3' is 32 lifted 23. */
export const spell = (v, s) => {
  const n = Math.abs(s), [ten, one] = s > 0 ? [0x302, 0x301] : [0x30C, 0x300]
  const run = (c, k) => k ? [hex(c) + (k > 1 ? ` ×${k}` : '')] : []
  return [hex(0x100 + v), ...run(ten, n / 10 | 0), ...run(one, n % 10)].join(' ')
}

// a rise over L bars, 0 to 1, as a cosine eases
const rise = (k, L) => .5 - .5 * Math.cos(Math.PI * clamp(k / L, 0, 1))

/**
 * Wave w's bar i of n: [lo, hi, width, roundness] – its foot and head in steps, its width a share of a unit. A wave is
 * a ribbon: its head rises from the floor to the top over ten bars, its foot follows nine bars behind, so a bar grows,
 * stands full, and shrinks to a mark at the top. The first wave thins as it goes; the second, a quarter lower,
 * widens and rounds.
 */
export const wave = (w, i, n) => {
  const u = i / (n - 1), base = w ? 0 : 27, lo = base + 73 * rise(i - 9.5, 9), hi = base + 73 * rise(i - .5, 10)
  return [Math.round(lo), Math.round(hi), w ? .06 + .88 * u : .94 - .88 * u, w ? 100 * u * u : 25]
}

/** The bars of two waves of n as they stand in a line: the second's j-th between the first's (j + 2)-th and next. */
export const order = n => [...Array.from({ length: n }, (_, i) => [0, i, i]), ...Array.from({ length: n }, (_, j) => [1, j, j + 2.5])]
  .sort((a, b) => a[2] - b[2]).map(([w, i]) => [w, i])

/**
 * Bar k of n's lift on the way in, `into` 0 to 1: from `from` to `to`, setting off one after another along the line –
 * the first at once, the last a third in – and all in place at the end, each easing in and out.
 */
export const arrive = (from, to, into, k, n) => { const s = k / (n - 1) / 3; return Math.round(from + (to - from) * swing(clamp((into - s) / (1 - s), 0, 1))) }

export function shifts() {
  const sec = $('#shifts'), box = $('.waves', sec), row = $('.wave', box)
  const outs = { char: $('.r-char', sec), code: $('.r-code', sec) }
  // two waves of twenty, one line of characters: each bar its value lifted, its own width and roundness; a unit of
  // width at least .12 of the height, a gap .06 of a unit. A bar's lift is lo where it stands, y where it's drawn
  const N = 20, UNIT = .12, GAP = .06
  const text = b => char(b.hi - b.lo) + shift(b.lo)
  const bars = order(N).map(([w, i], k) => {
    const [lo, hi, fill, rond] = wave(w, i, N), b = { lo, hi, y: lo, fill, k, down: !w, el: h('span'), x: 0, w: 0 }
    b.el.textContent = lead(text(b)), b.el.style.setProperty('--rond', rond)
    return b
  })
  row.replaceChildren(...bars.map(b => b.el))

  // on the way in, the bars come to where they stand as the slide does, by their marks: the first wave's down from
  // the slide's top, the second's up from its foot, while they're in sight. The way in is 0 as the slide's top comes a
  // fifth of the screen up – the waves showing – and 1 once its foot is on the screen's: scrolled to its end. Looked at
  // while the slide is in view, and once more as it leaves
  let into = 1, near = false, raf = 0
  const way = () => {
    if (still) return 1
    const r = sec.getBoundingClientRect(), from = 0.8 * innerHeight, to = innerHeight - r.height
    return clamp((from - r.top) / (from - to), 0, 1)
  }
  const draw = b => {
    const [a, z] = reach(b), y = arrive(b.down ? z : a, b.lo, into, b.k, bars.length)
    if (y !== b.y) b.y = y, b.el.textContent = lead(char(b.hi - b.lo) + shift(y))
  }
  const enter = () => { raf = 0; const w = way(); if (w !== into) into = w, bars.forEach(draw) }
  addEventListener('scroll', () => near && (raf ||= requestAnimationFrame(enter)), { passive: true })
  seen(sec, v => { near = v, enter() })

  // across the box, edge to edge, as the axes' specimen is: the unit what the bars and their gaps share of its width;
  // as high as the box, or, where the box is narrow, as high as a unit is a share of, in its middle. A step a
  // hundredth of that. Each bar on whole device pixels, and one gap after each – the margin after a bar takes the next
  // to its place. The slide's top and foot, steps over the line's floor: how far a bar may go
  let F = 0, base = 0, top = 100, foot = -100
  new ResizeObserver(() => {
    const px = 1 / (devicePixelRatio || 1), W = box.clientWidth, whole = v => Math.max(px, Math.round(v / px) * px)
    const U = W / (bars.reduce((t, b) => t + b.fill, 0) + (bars.length - 1) * GAP), g = whole(GAP * U)
    F = Math.min(box.clientHeight, U / UNIT), base = Math.round((box.clientHeight - F) / 2 / px) * px
    bars.forEach(b => b.w = whole(b.fill * U))
    let x = Math.round((W - bars.reduce((t, b) => t + b.w + g, -g)) / 2 / px) * px
    Object.assign(row.style, { fontSize: `${F}px`, left: `${x}px`, bottom: `${base}px` })
    bars.forEach((b, i) => {
      const wght = weight(b.w, F)
      b.x = x, x += b.w + g, b.el.style.setProperty('--wght', wght)
      b.el.style.marginRight = i < bars.length - 1 ? `${(b.w + g - wght * F / 4000).toFixed(4)}px` : '0'
    })
    const s = sec.getBoundingClientRect()
    top = (floor() - s.top) / F * 100, foot = (floor() - s.bottom) / F * 100
    into = way(), bars.forEach(draw)
  }).observe(box)

  // the bar picked, as the 127 values' grid has it: lit, and read out – its character and marks, and their code
  // points, each selectable and a click to copy. Under a drag the code points wait till the hand rests: they grow and
  // shrink as a run of marks comes and goes, and would shake the copy button after them
  let cur = null, settle = 0
  const show = (now = true) => {
    const code = () => outs.code.textContent = spell(cur.hi - cur.lo, cur.lo)
    outs.char.textContent = text(cur), clearTimeout(settle), now ? code() : settle = setTimeout(code, 150)
  }
  const pick = b => { cur?.el.classList.remove('is-lit'), cur = b, b.el.classList.add('is-lit'), show() }
  // the line's floor, px down the viewport
  const floor = () => box.getBoundingClientRect().bottom - base
  // how far a bar may lift, lowest to highest: as far as the marks go, a hundred steps either way, and the slide's
  // edges let it
  const reach = b => [Math.max(-100, Math.ceil(foot)), Math.min(100, Math.floor(top) - (b.hi - b.lo))]
  // a bar moves up or down: its marks change, its value doesn't
  const move = (b, lo) => {
    const v = b.hi - b.lo
    lo = clamp(lo, ...reach(b))
    if (lo !== b.lo) b.hi = lo + v, b.lo = lo, draw(b), b === cur && show(!drag?.on)
  }
  // the bar the pointer is on, as it's drawn, or nearest it within a few pixels
  const at = e => {
    const x = e.clientX - box.getBoundingClientRect().left, y = (floor() - e.clientY) / F * 100
    let near = null, d = 6
    for (const b of bars) {
      const v = b.hi - b.lo, dx = Math.max(0, b.x - x, x - b.x - b.w), dy = Math.max(0, b.y - y, y - b.y - Math.max(v, 1)) * F / 100
      if (Math.hypot(dx, dy) <= d) near = b, d = Math.hypot(dx, dy)
    }
    return near
  }
  // press a bar to pick it – anywhere on the slide it's been moved to, but the readout; drag it up or down to lift or
  // lower it, or across to select the bars as text – whichever way it first goes. A finger on a bar holds the page
  // still; anywhere else it scrolls. The arrows pick the next or move it a step, ten with shift
  let drag = null
  const held = e => !e.target.closest('.readout') && at(e)
  sec.addEventListener('pointerdown', e => {
    const b = held(e)
    if (b) pick(b), drag = { b, x: e.clientX, y: e.clientY, lo: b.lo, on: false }
  })
  sec.addEventListener('touchstart', e => { if (e.touches.length === 1 && held(e.touches[0])) e.preventDefault() }, { passive: false })
  sec.addEventListener('pointermove', e => {
    if (!drag) return sec.classList.toggle('is-over', !e.target.closest('.readout') && !!at(e))
    if (!drag.on) {
      const dx = Math.abs(e.clientX - drag.x), dy = Math.abs(e.clientY - drag.y)
      if (Math.max(dx, dy) < 4) return
      if (dx >= dy) return drag = null
      drag.on = true, sec.setPointerCapture(e.pointerId), getSelection().removeAllRanges(), sec.classList.add('is-dragging')
    }
    move(drag.b, drag.lo + Math.round((drag.y - e.clientY) / F * 100))
  })
  const drop = () => { if (drag?.on) show(); drag = null, sec.classList.remove('is-dragging') }
  sec.addEventListener('pointerup', drop), sec.addEventListener('pointercancel', drop)
  box.addEventListener('keydown', e => {
    const k = e.key, i = bars.indexOf(cur)
    if (k === 'ArrowLeft' || k === 'ArrowRight') pick(bars[clamp(i + (k === 'ArrowRight' ? 1 : -1), 0, bars.length - 1)])
    else if (k === 'ArrowUp' || k === 'ArrowDown') move(cur, cur.lo + (k === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1))
    else return
    e.preventDefault()
  })
  copyable($('.readout', sec), outs.char)
  pick(bars.find(b => b.lo > 40 && b.hi - b.lo > 20))
}
