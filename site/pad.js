/**
 * Get: a line of bars across the screen, a wave through a Hann window, as the audio logo is – one cycle of a sine
 * through it is the logo, sin x (1 + cos x). Here the wave is a sine and half its octave, the octave turning against
 * it, so its shape turns too; its crests run on as its cycles breathe, from the logo's one to four and back. Over the
 * line bars stand on it, under it they hang from it – bars shifted down. A pencil draws on it and copy takes it as
 * text, either holding it as it is; play sets it going again.
 */
import { fit } from './wave.js'
import { range } from './shifts.js'
import { $, still, ease, seen, copy } from './dom.js'

// the cycles breathe once in B seconds, the crests travel V lines a second, the octave turns against the sine once in O
const B = 40, V = 0.05, O = 14

/**
 * The wave at t seconds as n bars, −100 to 100: cycles c = 2.5 − 1.5 cos(2πt / B) and the phase V ∫c dt, so the crests
 * travel as fast however tight they are. At 0, the logo's two lobes: up, then as far down.
 */
export const packet = (t, n) => {
  const a = 2 * Math.PI * t / B, c = 2.5 - 1.5 * Math.cos(a), phase = V * (2.5 * t - 1.5 * B / (2 * Math.PI) * Math.sin(a))
  return Array.from({ length: n }, (_, i) => {
    const u = (i + 0.5) / n, x = 2 * Math.PI * (phase - c * (u - 0.5))
    return 100 / 1.5 * (Math.sin(x) + 0.5 * Math.sin(2 * x + 2 * Math.PI * t / O)) * Math.sin(Math.PI * u) ** 2
  })
}

export function pad() {
  const sec = $('#get'), line = $('.pad-bars'), btn = $('.pad-copy'), play = $('.pad-play'), N = 48
  // each bar a step from the line at least: the window's ends a row of dots, as the logo's axis. A drawing, when play
  // is pressed, eases into the wave
  const values = Array(N).fill(0)
  let t = 0, drawn = null, t0 = 0
  const frame = () => {
    const k = drawn ? ease(Math.min(1, (t - t0) / 0.8)) : 1
    packet(t, N).forEach((y, i) => {
      if (drawn) y = drawn[i] + (y - drawn[i]) * k
      values[i] = Math.round(y) || Math.sign(y) || 1
    })
    if (k === 1) drawn = null
  }
  const text = () => values.map(v => v < 0 ? range(v, 0) : range(0, v)).join('')
  let P = 0, F = 0
  // shown after a blank, out of view a pitch to the left: a line starting with a moved bar is moved whole in WebKit
  const show = () => { const s = ' ' + text(); if (line.textContent !== s) line.textContent = s }
  const layout = () => { P = fit(line, N, 0.5), F = parseFloat(getComputedStyle(line).fontSize), line.style.textIndent = `${-P}px` }
  frame(), new ResizeObserver(() => (layout(), show())).observe(line)

  // it moves while on and in view: on from the start, unless the page is to keep still – then it stands at its start,
  // the logo's two lobes. A frame steps a tenth of a second at most: back from a hidden tab, it goes on where it was
  let on = false, near = false, raf = 0, last = 0
  const tick = now => { t += Math.min(0.1, (now - last) / 1000), last = now, frame(), show(), raf = requestAnimationFrame(tick) }
  const run = () => { cancelAnimationFrame(raf); if (on && near) raf = requestAnimationFrame(now => tick(last = now)) }
  const turn = go => {
    if (go && !on) drawn = values.slice(), t0 = t
    const name = `${go ? 'Pause' : 'Play'} the wave`
    on = go, play.classList.toggle('is-playing', go), play.setAttribute('aria-label', name), play.title = name, run()
  }
  turn(!still), seen(sec, v => (near = v, run()))
  play.addEventListener('click', () => turn(!on))

  // the pencil: the bar under its tip reaches from the line – a line-height down from the box's top – to the tip, as
  // far under the line as the box goes; a stroke fills the bars it passes between two moves. A finger draws once it
  // taps or goes across: going up or down, it's scrolling the page, and the wave goes on
  let from = null, press = null, drawing = false
  const at = e => {
    const r = line.getBoundingClientRect(), v = Math.round((r.top + F - e.clientY) / F * 100)
    return [Math.min(N - 1, Math.max(0, Math.floor((e.clientX - r.left) / P))), Math.min(100, Math.max(Math.round((F - r.height) / F * 100), v))]
  }
  const stroke = ([i, v]) => {
    const [i0, v0] = from ?? [i, v]
    for (let k = Math.min(i0, i); k <= Math.max(i0, i); k++) values[k] = i === i0 ? v : Math.round(v0 + (v - v0) * (k - i0) / (i - i0))
    from = [i, v], show()
  }
  const begin = e => { press = null, drawing = true, turn(false), from = null, stroke(at(e)) }
  line.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') press = e; else line.setPointerCapture(e.pointerId), begin(e) })
  line.addEventListener('pointermove', e => {
    if (press) {
      const dx = Math.abs(e.clientX - press.clientX), dy = Math.abs(e.clientY - press.clientY)
      if (Math.max(dx, dy) >= 4) dx > dy ? (line.setPointerCapture(e.pointerId), begin(press)) : press = null
    }
    if (drawing) stroke(at(e))
  })
  line.addEventListener('pointerup', () => { if (press) begin(press); from = press = null, drawing = false })
  line.addEventListener('pointercancel', () => { from = press = null, drawing = false })
  // what's copied is what shows: the wave holds. A tick for a moment when copied; the title says if it wasn't
  btn.addEventListener('click', () => { turn(false), copy(btn, text()) })
}
