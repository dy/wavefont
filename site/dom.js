/** The few DOM helpers the site's modules share. */

export const $ = (s, root = document) => root.querySelector(s)
export const $$ = (s, root = document) => [...root.querySelectorAll(s)]

export const still = matchMedia('(prefers-reduced-motion: reduce)').matches
export const ease = x => 1 - (1 - x) ** 3
export const swing = x => x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2

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

/** Deterministic noise, so every visit draws the same. */
export const noise = seed => () => (seed = Math.imul(seed ^ seed >>> 15, 2246822507) + 0x9E3779B9 | 0, (seed >>> 0) / 4294967296)
