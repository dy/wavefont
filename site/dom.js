/** The few DOM helpers the site's modules share. */

export const $ = (s, root = document) => root.querySelector(s)
export const $$ = (s, root = document) => [...root.querySelectorAll(s)]

export const still = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
export const ease = x => 1 - (1 - x) ** 3
export const swing = x => x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2

/** A device pixel, in CSS px: bars whose edges land on these draw crisp and alike. */
export const dpx = () => 1 / (globalThis.devicePixelRatio || 1)

/** Element with properties and children. */
export const h = (tag, props = {}, ...kids) => {
  const e = Object.assign(document.createElement(tag), props)
  e.append(...kids)
  return e
}

/** Run fn once the element is within a screen of the viewport: work waits until it's about to be seen. */
export const soon = (el, fn) => new IntersectionObserver((es, io) => { if (es.some(e => e.isIntersecting)) io.disconnect(), fn() }, { rootMargin: '100% 0px' }).observe(el)

/** on(true) as el comes into view, on(false) as it leaves – as it stands at the last report, when a busy frame brings several. */
export const seen = (el, on, threshold = 0) => new IntersectionObserver(es => on(es.at(-1).isIntersecting), { threshold }).observe(el)

/**
 * A rise: bars going up from the floor to where they stand, each from a moment of its own – delays[k] ms in – over ms,
 * easing out. On every frame draw(xs) is given how far up each is, 0 to 1; on the last, all are 1. Returns its stop.
 */
export const rise = (delays, draw, ms = 250) => {
  const t0 = performance.now()
  let raf = 0
  const frame = now => {
    const xs = delays.map(d => ease(Math.min(1, Math.max(0, (now - t0 - d) / ms))))
    draw(xs)
    if (xs.some(x => x < 1)) raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}

/**
 * A slide whose bars rise: they stand at the floor while it's out of view, and go up as it comes in, once a visit,
 * each from a moment of its own. draw(xs) writes them, xs[k] how far up bar k is – as the font's own characters, not
 * moved by CSS. Returns the slide's way in; none, and the bars as they are, where the page is to keep still.
 */
export const rising = (sec, delays, draw) => {
  if (still) return
  let stop = () => {}, up = false
  const set = x => (stop(), draw(delays.map(() => x)))
  set(0), seen(sec, on => on || (up = false, set(0)))
  return () => { if (!up) up = true, stop = rise(delays, draw) }
}

/**
 * A walk over named stops: each step, a name at random – never one three times running – and a stop of its other
 * than where it is now, now(name). next() → [name, stop].
 */
export const wander = (stops, now, rnd = Math.random) => {
  const any = a => a[rnd() * a.length | 0]
  let last = []
  return () => {
    const name = any(Object.keys(stops).filter(n => !(last[0] === n && last[1] === n)))
    last = [name, last[0]]
    return [name, any(stops[name].filter(v => v !== now(name)))]
  }
}

/** Deterministic noise, so every visit draws the same. */
export const noise = seed => () => (seed = Math.imul(seed ^ seed >>> 15, 2246822507) + 0x9E3779B9 | 0, (seed >>> 0) / 4294967296)

/** Copy text: the button shows a tick for a moment, or its title says it couldn't. */
export const copy = async (b, text) => {
  const was = b.title
  try { await navigator.clipboard.writeText(text), b.classList.add('is-done') } catch { b.title = 'Copy failed' }
  setTimeout(() => (b.classList.remove('is-done'), b.title = was), 1200)
}

/**
 * A readout: each value copies itself when clicked – a drag across it selects it instead – or on Enter or Space; its
 * one copy button copies `main`, and shows the tick for any.
 */
export const copyable = (box, main) => {
  const btn = $('button.copy', box), take = el => copy(btn, el.textContent)
  $$('[role="button"]', box).forEach(el => {
    el.addEventListener('click', () => getSelection().isCollapsed && take(el))
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault(), take(el) })
  })
  btn.addEventListener('click', () => take(main))
}
