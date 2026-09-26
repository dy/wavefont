/**
 * Wavefont site. Every bar on the page is a character set in Wavefont;
 * this script only decides which characters to write.
 */
import wf, { char, bar, bars } from '../index.js'
import { levels, song, play, CHAPTERS, BPM } from './sound.js'
import { copy, fit, highlight } from './wave.js'
import { draw, banded, ring, motion } from './art.js'
import { tiles as TILES, ring as RING, art as ART } from './art-data.js'
import { bench, weather, commits } from './data.js'
import { $, $$, h, soon, seen, animate, noise, still, ease, swing } from './dom.js'
import { chat } from './chat.js'
import { memo } from './memo.js'

/** Letter the bars: one centred cell per character of s. */
const letter = (row, s) => row.replaceChildren(...Array.from(s, c => h('span', { textContent: c === ' ' ? ' ' : c })))

/** Value a keyboard character draws, as the font maps it: 0–9 step 10, a–z A–Z step 2. */
const valueOf = c => {
  const k = c.charCodeAt(0)
  if (k >= 48 && k <= 57) return Math.max(1, (k - 48) * 10)
  if (k >= 97 && k <= 122) return Math.max(1, (k - 97) * 2)
  if (k >= 65 && k <= 90) return Math.min(100, 52 + (k - 65) * 2)
  if (k >= 0x100 && k < 0x180) return k - 0x100
  return 1
}


/* ── hero: the name, set in itself ───────────────────────────────────────── */

function hero() {
  const field = $('.mark-bars'), letters = $('.mark-letters'), box = $('.mark')
  const NAME = 'Wavefont', MAX = 20
  let typing = 0

  const sync = () => {
    let s = field.textContent.replace(/[\r\n]/g, '')
    if (s.length > MAX) {
      s = s.slice(0, MAX), field.textContent = s
      getSelection().collapse(field.firstChild, s.length)
    }
    box.style.setProperty('--n', Math.max(8, s.length))
    letter(letters, s)
  }
  field.addEventListener('keydown', e => e.key === 'Enter' && e.preventDefault())
  field.addEventListener('input', sync)
  field.addEventListener('focus', () => { if (typing) cancelAnimationFrame(typing), typing = 0, field.textContent = NAME, sync() })

  if (still) return sync()
  // type the name in: each bar grows from nothing to its letter, then the letter lands under it
  field.textContent = '', letter(letters, '')
  const t0 = performance.now() + 350, per = 150
  const step = now => {
    const t = (now - t0) / per, i = Math.floor(t)
    if (i >= NAME.length) return typing = 0, field.textContent = NAME, sync()
    if (i >= 0) {
      const done = NAME.slice(0, i)
      field.textContent = done + char(ease(Math.min(1, t - i)) * valueOf(NAME[i]))
      letter(letters, done)
    }
    typing = requestAnimationFrame(step)
  }
  typing = requestAnimationFrame(step)
}


/* ── 127 values ──────────────────────────────────────────────────────────── */

function values() {
  const grid = $('.grid'), rv = $('.r-value'), rc = $('.r-char'), rcode = $('.r-code')
  const code = v => 'U+' + (0x100 + v).toString(16).toUpperCase().padStart(4, '0')
  const cells = Array.from({ length: 128 }, (_, v) => h('button', { type: 'button', textContent: char(v), tabIndex: v === 64 ? 0 : -1 }))
  cells.forEach((b, v) => b.setAttribute('aria-label', `Value ${v}, ${code(v)}`))
  grid.replaceChildren(...cells)

  let current = 64
  const show = v => {
    cells[current].removeAttribute('aria-current')
    current = v
    cells[v].setAttribute('aria-current', 'true')
    rv.textContent = v, rc.textContent = char(v), rcode.textContent = code(v)
  }
  show(64)
  grid.addEventListener('pointerover', e => e.target.parentNode === grid && show(cells.indexOf(e.target)))
  grid.addEventListener('focusin', e => show(cells.indexOf(e.target)))
  grid.addEventListener('click', async e => {
    const v = cells.indexOf(e.target)
    if (v < 0) return
    show(v)
    try { await navigator.clipboard.writeText(char(v)), rcode.textContent = 'copied' } catch {}
  })
  grid.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 16, ArrowUp: -16 }[e.key]
    if (!d) return
    e.preventDefault()
    const v = Math.min(127, Math.max(0, current + d))
    cells[current].tabIndex = -1, cells[v].tabIndex = 0, cells[v].focus()
  })

  // on entering: every bar rises to its value, a diagonal wave across the grid
  return () => {
    if (still) return
    const t0 = performance.now()
    const step = now => {
      let busy = false
      cells.forEach((b, v) => {
        const x = Math.min(1, Math.max(0, (now - t0 - ((v % 16) + (v >> 4)) * 28) / 500))
        if (x < 1) busy = true
        b.textContent = char(v * ease(x))
      })
      if (busy) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
}


/* ── latin+ core ─────────────────────────────────────────────────────────── */

function keys() {
  for (const dd of $$('.rosetta')) dd.replaceChildren(...Array.from(dd.dataset.keys, c => h('span', { className: 'k' }, h('b', { className: 'wf', textContent: c }), c)))
}


/* ── 3 axes: every corner of their cube, one axis moving at a time ───────── */

function axes() {
  const sec = $('#axes'), spec = $('.specimen'), inputs = $$('.axes input')
  const TAGS = { wght: 'wght', rond: 'ROND', yela: 'YELA' }
  const input = name => inputs.find(i => i.name === name)
  spec.textContent = wf(4, 12, 24, 40, 58, 74, 88, 98, 88, 74, 58, 40, 24, 12, 4)

  const set = (name, v) => {
    v = Math.round(v)
    input(name).value = v
    input(name).nextElementSibling.textContent = `${TAGS[name]} ${v}`
    spec.style.setProperty('--' + name, v)
  }
  inputs.forEach(i => set(i.name, +i.value))

  // to a corner, then round all eight: a Gray code, so each move changes one axis, end to end
  const INTO = [['wght', 1000], ['yela', -100]]
  const ROUND = [['yela', 100], ['rond', 100], ['yela', -100], ['wght', 4], ['yela', 100], ['rond', 0], ['yela', -100], ['wght', 1000]]
  const MOVE = 900, HOLD = 450
  let raf = 0, k = 0, t0 = null, from = 0
  const step = now => {
    const [name, to] = k < INTO.length ? INTO[k] : ROUND[(k - INTO.length) % ROUND.length]
    if (t0 === null) t0 = now, from = +input(name).value
    set(name, from + (to - from) * swing(Math.min(1, (now - t0) / MOVE)))
    if (now - t0 >= MOVE + HOLD) k++, t0 = null
    raf = requestAnimationFrame(step)
  }
  const run = on => { cancelAnimationFrame(raf), t0 = null; if (on && !still) raf = requestAnimationFrame(step) }
  // a hand on a slider stops the tour; it picks up from there when the slide comes back into view
  inputs.forEach(i => i.addEventListener('input', () => { run(false), set(i.name, +i.value) }))
  seen(sec, run, 0.35)
}


/* ── textual semantics: a document, as in the article ────────────────────── */

function textDoc() {
  const sec = $('#text'), doc = $('.doc'), title = $('.doc-title'), body = $('.doc-body'), blocks = [title, body]
  const box = $('.weights'), count = $('.doc-count')
  const r = noise(11)
  const swell = (n, peak) => Array.from({ length: n }, (_, i) => Math.max(3, peak * Math.sin(Math.PI * (i + 0.5) / n) ** 0.8 * (0.55 + 0.45 * r())))

  // a title that swells and fades; hyphens draw as the dashes at its ends
  title.textContent = '--' + wf(Array.from({ length: 19 }, (_, i) => 6 + 92 * Math.sin(Math.PI * (i + 0.5) / 19) ** 1.3)) + '--'
  // words of speech; a quiet run is hyphens: dots that end a word the way a pause does
  const word = () => wf(swell(3 + r() * 14 | 0, 18 + r() * 52))
  const para = n => Array.from({ length: n }, () => word() + (r() < 0.3 ? '-'.repeat(1 + r() * 7 | 0) : '')).join(' ')
  body.textContent = para(40) + '\n\n' + para(22)

  // a block is text, runs of it wrapped in spans of their own weight: characters count across both
  const offset = (block, node, off) => { const rg = document.createRange(); rg.setStart(block, 0), rg.setEnd(node, off); return rg.toString().length }
  // where a range starts, a boundary between runs belongs to the run after it; where it ends, to the one before
  const point = (block, n, start) => {
    const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
    let last = null
    for (let t; (t = walk.nextNode()); last = t) { if (n < t.length || n === t.length && !start) return [t, n]; n -= t.length }
    return last ? [last, last.length] : [block, 0]
  }
  // each character's weight: 0 is the block's own
  const read = block => {
    let s = ''
    const ws = []
    for (const n of block.childNodes) {
      const w = n.nodeType === 1 ? +n.style.getPropertyValue('--wght') || 0 : 0
      s += n.textContent, ws.push(...Array(n.textContent.length).fill(w))
    }
    return [s, ws]
  }
  const write = (block, s, ws) => {
    const kids = []
    for (let i = 0, j; i < s.length; i = j) {
      for (j = i + 1; j < s.length && ws[j] === ws[i];) j++
      if (!ws[i]) { kids.push(s.slice(i, j)); continue }
      const span = h('span', { textContent: s.slice(i, j) })
      span.style.setProperty('--wght', ws[i]), kids.push(span)
    }
    block.replaceChildren(...kids)
  }
  // the part of a block a range covers, as character offsets
  const span = (rg, b) => [
    rg.comparePoint(b, 0) >= 0 ? 0 : offset(b, rg.startContainer, rg.startOffset),
    rg.comparePoint(b, b.childNodes.length) <= 0 ? read(b)[0].length : offset(b, rg.endContainer, rg.endOffset)
  ]
  const inside = () => {
    const sel = getSelection(), rg = sel.rangeCount && sel.getRangeAt(0)
    return rg && doc.contains(rg.commonAncestorContainer) ? rg : null
  }
  // the word at a caret, as word processors take it
  const wordAt = rg => {
    const b = blocks.find(b => b.contains(rg.startContainer))
    if (!b) return null
    const at = offset(b, rg.startContainer, rg.startOffset)
    for (const m of read(b)[0].matchAll(/\p{L}+/gu)) if (m.index <= at && at <= m.index + m[0].length) {
      const out = document.createRange()
      out.setStart(...point(b, m.index, true)), out.setEnd(...point(b, m.index + m[0].length))
      return out
    }
    return null
  }

  // weights, as the article's toolbar: each icon is four bars at that weight, for the selected text only
  const WEIGHTS = [100, 220, 400, 640, 1000]
  let kept = null // a tap on the toolbar can take the selection away on touch screens: keep the last one
  const apply = w => {
    let rg = inside() ?? kept
    if (rg?.collapsed) rg = wordAt(rg)
    if (!rg || rg.collapsed) return
    const done = []
    for (const b of blocks) {
      if (!rg.intersectsNode(b)) continue
      const [a, z] = span(rg, b), [s, ws] = read(b), base = +getComputedStyle(b).getPropertyValue('--wght')
      if (a >= z) continue
      ws.fill(w === base ? 0 : w, a, z), write(b, s, ws), done.push([b, a, z])
    }
    if (!done.length) return
    // the same characters stay selected
    getSelection().setBaseAndExtent(...point(done[0][0], done[0][1], true), ...point(done.at(-1)[0], done.at(-1)[2]))
  }
  box.replaceChildren(...WEIGHTS.map(w => {
    const icon = h('span', { className: 'wf', textContent: wf(100, 100, 100, 100) }), b = h('button', { type: 'button' }, icon)
    icon.style.setProperty('--wght', w)
    b.dataset.w = w, b.setAttribute('aria-label', `Weight ${w}`), b.setAttribute('aria-pressed', 'false')
    b.addEventListener('click', () => apply(w))
    return b
  }))
  box.addEventListener('mousedown', e => e.preventDefault())
  // the toolbar shows the weight of the first selected character, or of the one before the caret
  const show = rg => {
    const b = rg && blocks.find(b => rg.intersectsNode(b))
    let w = null
    if (b) {
      const [a] = span(rg, b), ws = read(b)[1]
      w = ws[rg.collapsed ? Math.max(0, a - 1) : a] || +getComputedStyle(b).getPropertyValue('--wght')
    }
    for (const x of box.children) x.setAttribute('aria-pressed', +x.dataset.w === w)
  }

  // words are runs of letters, as for any text: U+0100–U+017F are Latin letters, hyphens and spaces end them
  const words = s => (s.match(/\p{L}+/gu) || []).length
  const tally = () => {
    const rg = inside(), all = words(doc.textContent)
    count.textContent = rg && !rg.collapsed ? `${words(rg.toString())} of ${all} words` : `${all} words`
  }
  document.addEventListener('selectionchange', () => {
    const rg = inside(), sel = getSelection()
    if (rg) kept = rg.cloneRange()
    else if (sel.rangeCount && !sel.isCollapsed) kept = null
    show(rg), tally()
  })
  doc.addEventListener('input', tally)
  // a new line is a character, as in any plain text
  doc.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(), document.execCommand('insertText', false, '\n') })
  tally(), show(null)

  // on entering: two words selected, a caret after them, as in the article (pointer devices only)
  const caret = h('div', { className: 'doc-caret', hidden: true })
  sec.append(caret)
  let shown = ''
  document.addEventListener('selectionchange', () => { if (shown && getSelection().toString() !== shown) caret.hidden = true, shown = '' })
  addEventListener('resize', () => caret.hidden = true)
  return () => {
    const sel = getSelection()
    if (still || !matchMedia('(hover: hover)').matches || (sel.rangeCount && !sel.isCollapsed)) return
    const m = [...read(body)[0].matchAll(/\p{L}+/gu)], a = m[26], b = m[27]
    sel.setBaseAndExtent(...point(body, a.index, true), ...point(body, b.index + b[0].length))
    const rects = sel.getRangeAt(0).getClientRects(), last = rects[rects.length - 1], s = sec.getBoundingClientRect()
    caret.style.cssText = `left:${last.right - s.left}px;top:${last.top - s.top - last.height * 0.1}px;height:${last.height * 1.2}px`
    caret.hidden = false, shown = sel.toString()
  }
}


/* ── vertical shift: rows of dashes lifted into rings ────────────────────── */

function field() {
  const box = $('.field')
  let rows = [], W = 0, H = 0, cx = 0.72, cy = 0.5, tx = cx, ty = cy
  const layout = () => {
    W = box.clientWidth, H = box.clientHeight
    const N = 30
    rows = Array.from({ length: N }, (_, j) => {
      // rows spread and dashes grow toward the viewer, as in perspective
      const y = H * ((j + 0.5) / N) ** 1.7, gap = H * (((j + 1) / N) ** 1.7 - (j / N) ** 1.7), s = 0.3 + 0.7 * (j + 0.5) / N
      const F = gap * 2.4, pitch = Math.max(9, 26 * s * Math.min(1, W / 1300) + 4), dash = Math.max(1, 2.2 * s)
      const el = h('div', { className: 'wf' })
      el.style.cssText = `font-size:${F.toFixed(2)}px;top:${(y - F / 2).toFixed(2)}px;left:${j % 2 ? -pitch / 2 : 0}px;--wght:${(dash / F * 4000).toFixed(1)};letter-spacing:${(pitch - dash).toFixed(2)}px`
      return { el, y, gap, F, pitch, n: Math.ceil(W / pitch) + 1, off: j % 2 ? -pitch / 2 : 0 }
    })
    box.replaceChildren(...rows.map(r => r.el))
  }
  // each dash is one range bar, 64 the middle of its line, lifted or lowered by the wave:
  // shift marks draw the same, but cost 11× more per frame in WebKit (26.5 against 2.4 ms for 4290 bars)
  const frame = t => {
    cx += (tx - cx) * 0.04, cy += (ty - cy) * 0.04
    for (const r of rows) {
      const len = 0.62 * r.gap / (0.01 * r.F), amp = 0.5 * r.gap / (0.01 * r.F), lo = [], hi = []
      for (let i = 0; i < r.n; i++) {
        const d = Math.hypot(r.off + i * r.pitch - cx * W, (r.y - cy * H) * 1.35)
        const lift = amp * Math.sin(2 * Math.PI * d / (0.08 * W) - t)
        lo.push(64 + lift - len / 2), hi.push(64 + lift + len / 2)
      }
      r.el.textContent = bars(lo, hi)
    }
  }
  new ResizeObserver(() => { layout(), frame(0) }).observe(box)
  box.addEventListener('pointermove', e => { const b = box.getBoundingClientRect(); tx = (e.clientX - b.left) / W, ty = (e.clientY - b.top) / H })
  animate(box, now => frame(now / 650))
}


/* ── bars by range: a year of weather, each day from its low to its high ─── */

function rangeChart() {
  const chart = $('.temp-bars'), read = $('.temp-read'), { year, lo, hi } = weather
  // −30 °C sits on the baseline (level 14), 40 °C one em above it (level 114): 0.7 °C a level
  const LOW = -30, HIGH = 40, level = c => 14 + (c - LOW) / (HIGH - LOW) * 100, zero = level(0)
  const date = i => new Date(Date.UTC(year, 0, 1 + i)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const deg = c => `${c < 0 ? '−' : ''}${Math.abs(c).toFixed(1)}`
  // a bar per day where there's room, else per week: the week's lowest low to its highest high
  const group = n => Array.from({ length: n }, (_, k) => {
    const a = Math.round(k * lo.length / n), b = Math.round((k + 1) * lo.length / n)
    return [Math.min(...lo.slice(a, b)), Math.max(...hi.slice(a, b)), a, b - 1]
  })
  let set = [], rise = 1, at = null
  const text = () => bars(set.map(([l]) => zero + (level(l) - zero) * rise), set.map(([, u]) => zero + (level(u) - zero) * rise))
  const low = lo.indexOf(Math.min(...lo)), high = hi.indexOf(Math.max(...hi))
  const summary = `lowest ${deg(lo[low])} °C on ${date(low)}, highest ${deg(hi[high])} °C on ${date(high)}`

  // the bar under the pointer, lit as a highlight: the text stays as it is
  const lit = highlight('pick'), range = new Range()
  const pick = k => {
    at = k
    lit?.clear()
    if (k == null) return read.textContent = summary, chart.setAttribute('aria-valuetext', summary)
    const [l, u, a, b] = set[k], when = a === b ? date(a) : `${date(a)}–${date(b)}`
    read.textContent = `${when}: ${deg(l)} to ${deg(u)} °C`
    chart.setAttribute('aria-valuenow', k + 1), chart.setAttribute('aria-valuetext', read.textContent)
    // a range bar is one code point, two UTF-16 units
    range.setStart(chart.firstChild, 2 * k), range.setEnd(chart.firstChild, 2 * k + 2), lit?.add(range)
  }
  new ResizeObserver(() => {
    const n = chart.clientWidth / 365 >= 2.4 ? 365 : 52
    if (n !== set.length) set = group(n), chart.textContent = text(), chart.setAttribute('aria-valuemax', n), pick(null)
    fit(chart, n, n === 365 ? 0.6 : 0.5)
  }).observe(chart)
  chart.addEventListener('pointermove', e => {
    const b = chart.getBoundingClientRect()
    pick(Math.min(set.length - 1, Math.max(0, Math.floor((e.clientX - b.left) / b.width * set.length))))
  })
  chart.addEventListener('pointerleave', () => pick(null))
  chart.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1, PageDown: 7, PageUp: -7 }[e.key]
    if (d) e.preventDefault(), pick(Math.min(set.length - 1, Math.max(0, (at ?? (d > 0 ? -1 : set.length)) + d)))
    else if (e.key === 'Escape') pick(null)
  })
  chart.addEventListener('blur', () => pick(null))

  // on entering: the bars unfold from 0 °C to the day's range
  return () => {
    if (still) return
    const t0 = performance.now()
    const step = now => {
      const x = Math.min(1, (now - t0) / 1200)
      rise = ease(x), chart.textContent = text()
      if (at != null) pick(at)
      if (x < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
}


/* ── 60 fps: what drawing an hour of speech costs, as text and otherwise ── */

function speed() {
  const sec = $('#speed'), lanes = $('.lanes'), opBox = $('.ops'), browserBox = $('.browsers')
  const { ops: OPS, stacks: STACKS, text: TEXT, browsers: DATA } = bench, BROWSERS = Object.keys(DATA)
  // milliseconds on a log scale: 0.1 on the floor, 1000 at the top
  const height = ms => ms ? Math.min(1, Math.max(0, (Math.log10(ms) + 1) / 4)) : 0
  const cols = STACKS.map((name, i) => {
    const glyph = h('span', { className: 'glyph wf' }), ms = h('span', { className: 'ms' })
    const label = h('span', { className: 'name' }, ...(TEXT[i] ? [h('b', { textContent: 'wavefont' }), ' '] : []), name)
    return { el: h('div', { className: 'col' + (i ? '' : ' is-ours') + (TEXT[i] ? ' is-text' : '') }, ms, glyph, label), glyph, ms, h: 0, from: 0, to: 0 }
  })
  lanes.replaceChildren(...cols.map(c => c.el))
  let op = 0, browser = BROWSERS[0], auto = true, raf = 0, t0 = 0, timer = 0

  const tween = now => {
    const k = still ? 1 : ease(Math.min(1, (now - t0) / 650))
    for (const c of cols) {
      c.h = c.from + (c.to - c.from) * k
      c.glyph.textContent = c.h ? bar(14, 14 + 100 * c.h) : '', c.el.style.setProperty('--h', c.h.toFixed(4))
    }
    if (k < 1) raf = requestAnimationFrame(tween)
  }
  const show = () => {
    const rows = DATA[browser]
    cols.forEach((c, i) => {
      const ms = rows[i]?.[op]
      c.from = c.h, c.to = height(ms)
      c.ms.textContent = ms == null ? 'n/a' : ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : Math.round(ms)
      c.el.classList.toggle('is-missing', ms == null)
    })
    lanes.setAttribute('aria-label', `${OPS[op]}, ${browser}, milliseconds: ` + STACKS.map((s, i) => `${TEXT[i] ? 'wavefont ' : ''}${s} ${rows[i]?.[op] ?? 'not measured'}`).join(', '))
    for (const b of opBox.children) b.setAttribute('aria-checked', b.textContent === OPS[op])
    for (const b of browserBox.children) b.setAttribute('aria-checked', b.textContent === browser)
    cancelAnimationFrame(raf), t0 = performance.now(), raf = requestAnimationFrame(tween)
  }
  const tabs = (box, names, pick) => box.replaceChildren(...names.map((n, i) => {
    const b = h('button', { type: 'button', textContent: n })
    b.setAttribute('role', 'radio'), b.addEventListener('click', () => { auto = false, clearInterval(timer), pick(i), show() })
    return b
  }))
  tabs(opBox, OPS, i => op = i)
  tabs(browserBox, BROWSERS, i => browser = BROWSERS[i])
  // bar width: two fifths of a column, whatever the width
  new ResizeObserver(() => {
    const F = lanes.clientHeight, w = lanes.clientWidth / cols.length
    lanes.style.setProperty('--wght', Math.min(1000, 0.4 * w / F * 4000).toFixed(1))
  }).observe(lanes)
  show()
  // while in view and untouched, it walks through the operations
  seen(sec, on => {
    clearInterval(timer)
    if (on && auto && !still) timer = setInterval(() => { op = (op + 1) % OPS.length, show() }, 2800)
  }, 0.4)
}


/* ── audio player: black, a tape of hairlines past the button ────────────── */

function player() {
  const strip = $('.strip'), tapes = $$('.strip .tape'), btn = $('.player .toggle')
  let buf = null, where = [], pitch = 0, loopW = 0, handle = null, raf = 0, pos = 0

  // the song, softly: one bar per sixteenth note, chapters apart, none at full height; two copies make the tape endless
  const ready = () => {
    if (buf) return
    buf = song(44100, 0.25)
    const step = 60 / BPM / 4, n = Math.round(buf.duration / step), lv = levels(buf.getChannelData(0), n, 22)
    const breaks = new Set(CHAPTERS.slice(1).map(([, b]) => Math.round(b * 16 * step / (buf.duration / n))))
    let text = ''
    for (let i = 0; i < n; i++) {
      if (breaks.has(i)) text += ' '
      where.push(text.length), text += char(Math.max(3, lv[i] * 86))
    }
    where.push(text.length)
    tapes.forEach(t => t.textContent = text + text)
    measure()
  }
  const measure = () => {
    if (!buf) return
    loopW = tapes[0].scrollWidth / 2, pitch = loopW / where.at(-1)
    place(pos)
  }
  // time t sits under the button, on the second copy of the song
  const place = t => {
    pos = t
    const k = t / buf.duration * (where.length - 1), i = Math.min(where.length - 2, Math.floor(k))
    const x = strip.clientWidth / 2 - loopW - (where[i] + (k - i)) * pitch
    tapes.forEach(el => el.style.setProperty('--x', `${x.toFixed(2)}px`))
    strip.setAttribute('aria-valuenow', Math.round(t))
  }
  const ui = on => { btn.classList.toggle('is-playing', on), btn.setAttribute('aria-label', on ? 'Pause' : 'Play') }
  const stop = () => {
    if (!handle) return
    const was = handle
    handle = null, pos = was.time(), was.stop(), cancelAnimationFrame(raf), ui(false)
  }
  const start = () => {
    ready()
    const mine = handle = play(buf, { from: pos, loop: true })
    mine.onend = () => { if (handle === mine) handle = null, cancelAnimationFrame(raf), ui(false) }
    const tick = () => { place(mine.time()), raf = requestAnimationFrame(tick) }
    tick(), ui(true)
  }
  const toggle = () => handle ? stop() : start()
  btn.addEventListener('click', toggle)
  strip.addEventListener('click', toggle)
  strip.addEventListener('keydown', e => {
    ready()
    const to = { ArrowRight: pos + 5, ArrowLeft: pos - 5 }[e.key]
    if (to != null) { e.preventDefault(); const on = !!handle; stop(); place((to + buf.duration) % buf.duration); on && start() }
    else if (e.key === ' ' || e.key === 'Enter') e.preventDefault(), toggle()
  })
  new ResizeObserver(measure).observe(strip)
  soon(strip, ready)
}


/* ── renderings and artworks: traced, set back as text ───────────────────── */

function renderings() {
  const box = $('.tiles'), pieces = []
  box.replaceChildren(...TILES.map(t => {
    const tile = h('div', { className: 'tile' })
    if (!t) tile.innerHTML = ring(RING)
    else {
      const el = h('div', { className: 'piece' })
      if (t.rond) el.style.setProperty('--rond', t.rond)
      tile.append(el), pieces.push([el, t])
    }
    return tile
  }))
  new ResizeObserver(() => pieces.forEach(([el, t]) => draw(el, t))).observe(box)
}

// each piece a screen of its own: it follows the pointer, and drifts on its own when left alone
function artwork(sec) {
  const name = sec.dataset.piece, el = $('.piece', sec), at = motion[name](ART[name])
  const rest = name === 'bands' ? banded(ART.bands) : ART[name]
  let p = { x: 0.5, y: 0.5 }, aim = null, t = 0, width = 0
  const frame = () => draw(el, still ? (aim ? at(0, aim) : rest) : at(t, p), width)
  sec.style.setProperty('--ar', (rest.w / rest.h).toFixed(4))
  el.dataset.ar = el.style.aspectRatio = `${rest.w} / ${rest.h}`
  new ResizeObserver(([e]) => { width = e.contentRect.width, frame() }).observe(el)
  el.addEventListener('pointermove', e => {
    const b = el.getBoundingClientRect()
    aim = { x: (e.clientX - b.left) / b.width, y: (e.clientY - b.top) / b.height }
    if (still) frame()
  })
  el.addEventListener('pointerleave', () => { aim = null; if (still) frame() })
  animate(sec, now => {
    t = now / 1000
    const to = aim ?? { x: 0.5 + 0.3 * Math.sin(t / 2.9), y: 0.5 + 0.28 * Math.sin(t / 4.1 + 1.3) }
    p = { x: p.x + (to.x - p.x) * 0.06, y: p.y + (to.y - p.y) * 0.06 }
    frame()
  })
}


/* ── journey: ten years of commits, as a recording ───────────────────────── */

function journey() {
  const el = $('.commits'), { months } = commits, top = Math.sqrt(Math.max(...months))
  // a bar per month, square-rooted so quiet months still show; a month with none is a dot
  el.textContent = wf(months.map(n => n ? 8 + 92 * Math.sqrt(n) / top : 1))
  new ResizeObserver(() => fit(el, months.length, 0.5)).observe(el)
}


/* ── get: install, and the numbers ───────────────────────────────────────── */

function get() {
  for (const b of $$('.copy-code')) b.addEventListener('click', () => copy(b, $$('.code', b.parentNode).map(c => c.textContent).join('\n\n')))
  fetch('package.json').then(r => r.json()).then(p => $('.s-version').textContent = p.version).catch(() => {})
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return
    io.disconnect()
    // size of the variable woff2 this page uses, asked late: the preload is long used by then
    fetch('fonts/variable/Wavefont[ROND,YELA,wght].woff2', { method: 'HEAD' })
      .then(r => +r.headers.get('content-length'))
      .then(n => n && ($('.s-size').textContent = `${(n / 1024).toFixed(1)} KB variable woff2`)).catch(() => {})
    npm()
  }, { rootMargin: '50% 0px' }).observe($('#get'))
}

// downloads, set inline in the sentence that reports them: one character per week
async function npm() {
  const total = $('.npm-total'), spark = $('.spark')
  try {
    const r = await fetch('https://api.npmjs.org/downloads/range/last-year/wavefont')
    if (!r.ok) throw Error(r.statusText)
    const { downloads } = await r.json(), weeks = []
    for (let i = 0; i + 7 <= downloads.length; i += 7) weeks.push(downloads.slice(i, i + 7).reduce((s, d) => s + d.downloads, 0))
    const max = Math.max(1, ...weeks)
    total.textContent = `${downloads.reduce((s, d) => s + d.downloads, 0).toLocaleString('en')} times`
    spark.textContent = wf(weeks.map(w => Math.max(2, w / max * 72)))
  } catch {
    $('.npm').remove()
  }
}


/* ── start ───────────────────────────────────────────────────────────────── */

hero()
keys()
axes()
field()
speed()
chat()
player()
soon($('#renderings'), renderings)
for (const sec of $$('.work')) soon(sec, () => artwork(sec))
memo()
journey()
get()

// each slide's own motion runs when most of it is in view
const onenter = { values: values(), text: textDoc(), range: rangeChart() }
const once = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && onenter[e.target.id]?.()), { threshold: 0.45 })
$$('main > section').forEach(s => once.observe(s))
