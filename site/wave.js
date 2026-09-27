/**
 * Waveform text: audio in, characters out, and back – click a bar to play from it, select bars to play them.
 * Shared by the site and the playground.
 */
import wf from '../index.js'
import { levels, record, play, audio } from './sound.js'

/** Seconds as m:ss. */
export const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/** Named CSS highlight, or null where the Custom Highlight API is missing (progress just won't paint). */
export const highlight = name => {
  if (!globalThis.Highlight || !CSS.highlights) return null
  const hl = new Highlight()
  CSS.highlights.set(name, hl)
  return hl
}
export const played = highlight('played')

/** Show a range as played; an empty one leaves the highlight, since WebKit paints a range collapsed at 0 as its whole text node. */
export const mark = range => {
  if (!played) return
  played.delete(range)
  if (!range.collapsed) played.add(range)
}

/** Copy text, then say so on the button for a moment. */
export const copy = async (btn, text) => {
  const was = btn.textContent
  try { await navigator.clipboard.writeText(text), btn.textContent = 'Copied' }
  catch { btn.textContent = 'Copy failed' }
  setTimeout(() => btn.textContent = was, 1400)
}

/**
 * wght of a bar w px wide at font size F px, on whole font units: a bar's advance is wght/4 units of 1000,
 * and Firefox rounds variable advances to whole units – a weight between them would draw every bar of a line
 * a little off, and the line drift by as much times its length.
 */
export const weight = (w, F) => 4 * Math.min(250, Math.max(1, Math.round(w / F * 1000)))

/**
 * Fill an element's width with n bars, `fill` of each pitch inked. The pitch is whole device pixels and the bars
 * as near as whole font units come, so every bar draws alike wherever it falls; returns the pitch, px.
 */
export const fit = (el, n, fill = 0.55, W = el.clientWidth) => {
  const F = parseFloat(getComputedStyle(el).fontSize)
  if (!W || !F) return 0
  const px = 1 / (globalThis.devicePixelRatio || 1), P = Math.max(2 * px, Math.floor(W / n / px) * px)
  const wght = weight(Math.max(px, Math.round(fill * P / px) * px), F)
  el.style.setProperty('--wght', wght)
  el.style.setProperty('--gap', `${(P - wght * F / 4000).toFixed(4)}px`)
  return P
}

/** Audio as n even bars with no gaps, `range` dB tall: a message bubble. */
export const strip = (buf, n, range = 42) => ({
  buf,
  text: wf(Array.from(levels(buf.getChannelData(0), n, range), v => Math.max(4, v * 100))),
  at: Array.from({ length: n + 1 }, (_, i) => i / n * buf.duration)
})

/** Character under the pointer, as an offset into el's text, or null. */
const offsetAt = (el, x, y) => {
  const p = document.caretPositionFromPoint?.(x, y), r = !p && document.caretRangeFromPoint?.(x, y)
  const node = p ? p.offsetNode : r?.startContainer
  return node && node === el.firstChild ? (p ? p.offset : r.startOffset) : null
}

/**
 * Make el's text a playable waveform: click a bar to play from it, select bars to play only them (unless `pick` is off).
 * Progress paints as a highlight, so the DOM – and any selection – stays untouched.
 */
export function track(el, { ontime, onstate, pick = true } = {}) {
  let tk, handle = null, pos = 0, rate = 1, raf = 0, last = ''
  const range = new Range()
  const chars = t => {
    let lo = 0, hi = tk.text.length
    while (lo < hi) { const m = lo + hi >> 1; tk.at[m] < t ? lo = m + 1 : hi = m }
    return lo
  }
  const paint = t => {
    const node = el.firstChild
    if (!played || !node) return
    range.setStart(node, 0)
    range.setEnd(node, Math.min(chars(t), node.length))
    mark(range)
  }
  const tick = () => {
    const t = handle.time()
    paint(t), ontime?.(t)
    raf = requestAnimationFrame(tick)
  }
  // stop now, without waiting for the source's ended event
  const halt = () => {
    if (!handle) return
    const h = handle
    handle = null, cancelAnimationFrame(raf), h.stop(), onstate?.(false)
  }

  const api = {
    get take() { return tk },
    get playing() { return !!handle },
    time: () => handle ? handle.time() : pos,
    set(next) {
      halt()
      tk = next, pos = 0
      el.textContent = tk.text
      paint(0), ontime?.(0)
    },
    play(from = pos, to = tk.buf.duration) {
      if (from >= to - 0.02) from = 0
      const mine = handle = play(tk.buf, { from, to, rate })
      mine.onend = () => {
        if (handle !== mine) return
        const t = mine.time()
        cancelAnimationFrame(raf)
        handle = null
        pos = t >= tk.buf.duration - 0.03 ? 0 : t
        paint(pos), ontime?.(pos), onstate?.(false)
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
      onstate?.(true)
    },
    pause() { handle?.stop() },
    toggle() { handle ? api.pause() : api.play() },
    seek(t) {
      pos = Math.max(0, Math.min(t, tk.buf.duration))
      if (handle) api.play(pos)
      else paint(pos), ontime?.(pos)
    },
    rate(r) { rate = r, handle?.rate(r) }
  }

  // select bars to hear them; one gesture can report twice (pointerup + dblclick), so play once
  const selected = () => {
    const s = getSelection()
    if (!tk || !s?.rangeCount || s.isCollapsed) return false
    const r = s.getRangeAt(0), node = el.firstChild
    if (!el.contains(r.startContainer) || !el.contains(r.endContainer)) return false
    const off = (n, o) => n === node ? o : o ? node.length : 0
    const a = off(r.startContainer, r.startOffset), b = off(r.endContainer, r.endOffset), key = a + ':' + b
    if (b <= a) return false
    if (key !== last) last = key, setTimeout(() => last = '', 400), api.play(tk.at[a], tk.at[b])
    return true
  }
  if (!pick) return api
  el.addEventListener('pointerup', () => setTimeout(selected))
  el.addEventListener('dblclick', () => setTimeout(selected))
  el.addEventListener('click', e => {
    if (!tk || selected()) return
    const o = offsetAt(el, e.clientX, e.clientY)
    if (o != null) api.play(tk.at[Math.min(o, tk.text.length - 1)])
  })
  return api
}

/**
 * Microphone to loudness levels, live: onlive(levels, seconds) runs as audio arrives, one level per dt seconds.
 * Resolves to the recorder: pause(), resume(), and stop() for the AudioBuffer.
 */
export async function listen(onlive, dt = 0.05) {
  const lv = [], frame = Math.round(audio().sampleRate * dt)
  let acc = 0, count = 0
  return record(chunk => {
    for (const v of chunk) {
      acc += v * v
      if (++count < frame) continue
      // fixed scale while live: -14 dBFS draws full height, 42 dB below draws nothing
      lv.push(Math.min(1, Math.max(0, 1 + (10 * Math.log10(acc / count + 1e-10) + 14) / 42)))
      acc = count = 0
    }
    onlive(lv, lv.length * dt)
  })
}

export const micError = e =>
  e.name === 'NotAllowedError' ? 'The microphone is blocked. Allow it for this page in the address bar, then try again.' :
  e.name === 'NotFoundError' ? 'No microphone found. Plug one in and try again.' :
  `Recording didn’t start: ${e.message || e.name}.`
