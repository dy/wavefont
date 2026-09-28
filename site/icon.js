/**
 * The tab's icon: the bars of the name, of what's typed in its place, or of what's last selected on the page, where
 * they stand on their line – dark, or light on a dark tab strip.
 */
import { $ } from './dom.js'
import { valueOf } from './wave.js'

/** Bars the icon has room for. */
export const N = 6

const LIFT = { '́': 1, '̂': 10, '̀': -1, '̌': -10 }
/**
 * The bars a line of text draws, aligned a (−1 floor, 0 middle, 1 ceiling): each [foot, top], 0 to 100 up the line,
 * or null for a character drawing nothing. Marks lift or lower the bar before them; a new line takes no place.
 */
export const line = (s, a = -1) => {
  const out = []
  for (const c of s) {
    const last = out.at(-1)
    if (/\p{M}/u.test(c)) { if (last && LIFT[c]) last[0] += LIFT[c], last[1] += LIFT[c]; continue }
    if (c === '\n') continue
    const v = valueOf(c), foot = (100 - v) * (a + 1) / 2
    out.push(v === undefined ? null : [foot, foot + v])
  }
  return out
}

/** More bars than there is room for: each keeps what its share covers, lowest foot to highest top, as a waveform's overview does. */
export const peaks = bars => bars.length <= N ? bars : Array.from({ length: N }, (_, i) =>
  bars.slice(Math.floor(i * bars.length / N), Math.floor((i + 1) * bars.length / N))
    .reduce((m, b) => !b ? m : !m ? b : [Math.min(m[0], b[0]), Math.max(m[1], b[1])], null))

/**
 * Bars in the 16-unit box, their room 15 wide and 12 tall, from 2 to 14: each [x, y, width, height], 3/5 of its
 * pitch wide, a unit tall at least and kept in the room; null for a blank.
 */
export const place = bars => {
  const p = 15 / Math.max(3, bars.length), x0 = 8 - p * bars.length / 2, up = v => 0.12 * Math.min(100, Math.max(0, v))
  return bars.map((b, i) => {
    if (!b) return null
    const h = Math.max(1, up(b[1]) - up(b[0]))
    return [x0 + (i + 0.2) * p, Math.min(14 - h, Math.max(2, 14 - (up(b[0]) + up(b[1])) / 2 - h / 2)), 0.6 * p, h]
  })
}

// the bars a range covers, each character set in Wavefont on its own line's alignment
const read = rg => {
  const root = rg.commonAncestorContainer, bars = []
  const walk = document.createTreeWalker(root.nodeType === 3 ? root.parentNode : root, NodeFilter.SHOW_TEXT)
  for (let t; (t = walk.nextNode());) {
    if (!rg.intersectsNode(t)) continue
    const el = t.parentElement, cs = getComputedStyle(el)
    if (!/^"?wavefont\b/i.test(cs.fontFamily) || el.checkVisibility?.() === false) continue
    bars.push(...line(t.data.slice(t === rg.startContainer ? rg.startOffset : 0, t === rg.endContainer ? rg.endOffset : t.length), (+cs.getPropertyValue('--yela') || 0) / 100))
  }
  return bars
}

let href = ''
/** The tab shows the bars a range covers, or an element holds; with none in it, the last stay. */
export const tab = at => {
  let rg = at
  if (!(at instanceof Range)) rg = new Range(), rg.selectNodeContents(at)
  const bars = peaks(read(rg))
  if (!bars.some(Boolean)) return
  const rects = place(bars).map(r => r ? `<rect x="${+r[0].toFixed(2)}" y="${+r[1].toFixed(2)}" width="${+r[2].toFixed(2)}" height="${+r[3].toFixed(2)}"/>` : '')
  const s = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#202025"><style>@media (prefers-color-scheme: dark) { svg { fill: #ecedf0 } }</style>${rects.join('')}</svg>`)
  if (s !== href) $('link[rel="icon"]').href = href = s
}

/** The tab follows the selection. */
export const icon = () => document.addEventListener('selectionchange', () => {
  const sel = getSelection()
  if (sel.rangeCount && !sel.isCollapsed) tab(sel.getRangeAt(0))
})
