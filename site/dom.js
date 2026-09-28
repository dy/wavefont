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
export const soon = (el, fn) => new IntersectionObserver(([e], io) => { if (e.isIntersecting) io.disconnect(), fn() }, { rootMargin: '100% 0px' }).observe(el)

/** on(true) as el comes into view, on(false) as it leaves. */
export const seen = (el, on, threshold = 0) => new IntersectionObserver(([e]) => on(e.isIntersecting), { threshold }).observe(el)

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
