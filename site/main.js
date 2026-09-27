/**
 * Wavefont site. Every bar on the page is a character set in Wavefont;
 * this script only decides which characters to write.
 */
import wf, { char, bar, bars } from '../index.js'
import { fit, weight } from './wave.js'
import { draw, ring, motion, tileMotion } from './art.js'
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

/** A device pixel, in CSS px: bars whose edges land on these draw crisp and alike. */
const dpx = () => 1 / (devicePixelRatio || 1)


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


/* ── 127 values: pick a bar, copy its value, character or code ──────────── */

function values() {
  const grid = $('.grid'), outs = { value: $('.r-value'), char: $('.r-char'), code: $('.r-code') }
  const code = v => 'U+' + (0x100 + v).toString(16).toUpperCase().padStart(4, '0')
  const cells = Array.from({ length: 128 }, (_, v) => {
    const b = h('button', { type: 'button', className: 'cell', textContent: char(v), tabIndex: -1 })
    b.style.gridArea = `${1 + (v >> 4)} / ${2 + v % 16}`
    b.setAttribute('aria-label', `Value ${v}`), b.setAttribute('aria-pressed', 'false')
    return b
  })
  // 0 and 127 stand on the lines of the first bar and the last; the readout goes under the grid's first column
  grid.replaceChildren(h('span', { className: 'edge from', textContent: '0' }), ...cells, h('span', { className: 'edge to', textContent: '127' }), $('.readout'))

  let current = 64
  const pick = v => {
    cells[current].setAttribute('aria-pressed', 'false'), cells[current].tabIndex = -1
    current = v
    cells[v].setAttribute('aria-pressed', 'true'), cells[v].tabIndex = 0
    outs.value.textContent = v, outs.char.textContent = char(v), outs.code.textContent = code(v)
  }
  pick(64)
  grid.addEventListener('click', e => { const v = cells.indexOf(e.target.closest('.cell')); if (v >= 0) pick(v) })
  grid.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 16, ArrowUp: -16 }[e.key]
    if (!d) return
    e.preventDefault(), pick(Math.min(127, Math.max(0, current + d))), cells[current].focus()
  })
  // each readout copies itself; its label says so for a moment
  for (const [name, b] of Object.entries(outs)) b.addEventListener('click', async () => {
    const dt = b.closest('div').querySelector('dt')
    try { await navigator.clipboard.writeText(b.textContent), dt.textContent = 'copied' } catch { dt.textContent = 'copy failed' }
    setTimeout(() => dt.textContent = name, 1200)
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
  // each key's bar over its name; a mark is shown on a bar of its own, named by its spacing form
  for (const set of $$('.rosetta[data-keys], .rosetta [data-keys]')) {
    const base = set.dataset.base ?? '', names = set.dataset.names?.split(' ')
    set.replaceChildren(...Array.from(set.dataset.keys, (c, i) => h('span', { className: 'k' }, h('b', { className: 'wf', textContent: base + c }), names?.[i] ?? c)))
  }
}


/* ── 3 axes: every corner of their cube, one axis moving at a time ───────── */

function axes() {
  const sec = $('#axes'), spec = $('.specimen'), inputs = $$('.axes input')
  const input = name => inputs.find(i => i.name === name)
  spec.textContent = wf(4, 12, 24, 40, 58, 74, 88, 98, 88, 74, 58, 40, 24, 12, 4)

  const set = (name, v) => {
    v = Math.round(v)
    input(name).value = v, input(name).nextElementSibling.textContent = v
    spec.style.setProperty('--' + name, v)
  }
  inputs.forEach(i => set(i.name, +i.value))

  // three looks – thin; thick and square; thick and round – at each of three alignments – bottom, middle, top:
  // nine, gone round so that each move changes one axis
  const INTO = [['wght', 50], ['yela', -100]]
  const ROUND = [['wght', 1000], ['rond', 100], ['yela', 0], ['yela', 100], ['rond', 0], ['yela', 0], ['wght', 50], ['yela', 100], ['yela', -100]]
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
  const doc = $('.doc'), title = $('.doc-title'), body = $('.doc-body'), blocks = [title, body]
  const box = $('.weights'), count = $('.doc-count')
  const r = noise(11)
  const swell = (n, peak) => Array.from({ length: n }, (_, i) => Math.max(3, peak * Math.sin(Math.PI * (i + 0.5) / n) ** 0.8 * (0.55 + 0.45 * r())))

  // a title that swells and fades; hyphens draw as the dashes at its ends
  title.textContent = '--' + wf(Array.from({ length: 19 }, (_, i) => 6 + 92 * Math.sin(Math.PI * (i + 0.5) / 19) ** 1.3)) + '--'
  // words of speech; a quiet run is hyphens: dots that end a word the way a pause does
  const word = () => wf(swell(3 + r() * 14 | 0, 18 + r() * 52))
  const para = n => Array.from({ length: n }, () => word() + (r() < 0.3 ? '-'.repeat(1 + r() * 7 | 0) : '')).join(' ')
  body.textContent = para(40) + '\n\n' + para(22)

  // weights as a share of the pitch, the heaviest filling it: the pitch stays, so bolder bars stand closer
  const FILL = [1 / 7, 2 / 7, 1 / 2, 3 / 4, 1], PITCH = new Map([[title, 0.24], [body, 1 / 7]]), BASE = new Map([[title, 2], [body, 0]])
  const icons = FILL.map(() => h('span', { className: 'wf', textContent: wf(100, 100, 100, 100) }))
  // pitch on whole device pixels, widths as near them as whole font units come, so each bar of a weight draws alike
  const crisp = (el, pitch) => {
    const px = dpx(), F = parseFloat(getComputedStyle(el).fontSize), P = Math.max(2 * px, Math.round(pitch * F / px) * px)
    FILL.forEach((f, k) => {
      const wght = weight(Math.min(P, Math.max(px, Math.round(f * P / px) * px)), F)
      el.style.setProperty(`--w${k}`, wght), el.style.setProperty(`--s${k}`, `${(P - wght * F / 4000).toFixed(4)}px`)
    })
  }
  // font sizes follow the viewport: set the widths once the font is in, and again on every resize
  const sharpen = () => { blocks.forEach(b => crisp(b, PITCH.get(b))), icons.forEach(i => crisp(i, 0.25)) }
  document.fonts.ready.then(sharpen), addEventListener('resize', sharpen)

  // a block is text, runs of it in spans of their weight: characters count across both
  const offset = (block, node, off) => { const rg = document.createRange(); rg.setStart(block, 0), rg.setEnd(node, off); return rg.toString().length }
  // where a range starts, a boundary between runs belongs to the run after it; where it ends, to the one before
  const point = (block, n, start) => {
    const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
    let last = null
    for (let t; (t = walk.nextNode()); last = t) { if (n < t.length || n === t.length && !start) return [t, n]; n -= t.length }
    return last ? [last, last.length] : [block, 0]
  }
  // each character's weight, as an index into FILL: -1 is the block's own
  const read = block => {
    let s = ''
    const ws = []
    for (const n of block.childNodes) {
      const k = n.nodeType === 1 ? +(n.className.match(/\bw(\d)\b/)?.[1] ?? -1) : -1
      s += n.textContent, ws.push(...Array(n.textContent.length).fill(k))
    }
    return [s, ws]
  }
  const write = (block, s, ws) => {
    const kids = []
    for (let i = 0, j; i < s.length; i = j) {
      for (j = i + 1; j < s.length && ws[j] === ws[i];) j++
      kids.push(ws[i] < 0 ? s.slice(i, j) : h('span', { className: 'w' + ws[i], textContent: s.slice(i, j) }))
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

  let kept = null // a tap on the toolbar can take the selection away on touch screens: keep the last one
  const apply = k => {
    let rg = inside() ?? kept
    if (rg?.collapsed) rg = wordAt(rg)
    if (!rg || rg.collapsed) return
    const done = []
    for (const b of blocks) {
      if (!rg.intersectsNode(b)) continue
      const [a, z] = span(rg, b), [s, ws] = read(b)
      if (a >= z) continue
      ws.fill(k === BASE.get(b) ? -1 : k, a, z), write(b, s, ws), done.push([b, a, z])
    }
    if (!done.length) return
    // the same characters stay selected
    getSelection().setBaseAndExtent(...point(done[0][0], done[0][1], true), ...point(done.at(-1)[0], done.at(-1)[2]))
  }
  box.replaceChildren(...icons.map((icon, k) => {
    const b = h('button', { type: 'button' }, icon)
    icon.style.setProperty('--wght', `var(--w${k})`), icon.style.letterSpacing = `var(--s${k})`
    b.dataset.k = k, b.setAttribute('aria-label', `Weight ${k + 1} of ${FILL.length}`), b.setAttribute('aria-pressed', 'false')
    b.addEventListener('click', () => apply(k))
    return b
  }))
  box.addEventListener('mousedown', e => e.preventDefault())
  // the toolbar shows the weight of the first selected character, or of the one before the caret
  const show = rg => {
    const b = rg && blocks.find(b => rg.intersectsNode(b))
    let k = -2
    if (b) { const [a] = span(rg, b), ws = read(b)[1], w = ws[rg.collapsed ? Math.max(0, a - 1) : a]; k = w >= 0 ? w : BASE.get(b) }
    for (const x of box.children) x.setAttribute('aria-pressed', +x.dataset.k === k)
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

  // on entering: the page edits itself – a word selected, then set bold, and left selected as any selection is
  let touched = false, timer = 0
  const hands = () => { touched = true, clearTimeout(timer) }
  doc.addEventListener('pointerdown', hands), doc.addEventListener('keydown', hands), box.addEventListener('pointerdown', hands)
  return () => {
    const sel = getSelection()
    if (still || touched || timer || !matchMedia('(hover: hover)').matches || (sel.rangeCount && !sel.isCollapsed)) return
    const w = [...read(body)[0].matchAll(/\p{L}+/gu)][24]
    const steps = [
      () => sel.setBaseAndExtent(...point(body, w.index, true), ...point(body, w.index + w[0].length)),
      () => { box.children[3].classList.add('is-pressed'), apply(3) },
      () => box.children[3].classList.remove('is-pressed')
    ]
    const next = (i = 0) => { if (touched || i >= steps.length) return; steps[i](), timer = setTimeout(() => next(i + 1), i ? 750 : 1100) }
    timer = setTimeout(next, 600)
  }
}


/* ── min–max bars: a year of weather, each day from its low to its high ─── */

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
  let set = [], rise = 1, at = null, pitch = 1
  const text = () => bars(set.map(([l]) => zero + (level(l) - zero) * rise), set.map(([, u]) => zero + (level(u) - zero) * rise))
  const low = lo.indexOf(Math.min(...lo)), high = hi.indexOf(Math.max(...hi))
  const summary = `lowest ${deg(lo[low])} °C on ${date(low)}, highest ${deg(hi[high])} °C on ${date(high)}`
  // days a to b (bars, inclusive): when, and the lowest low to the highest high
  const say = (a, b) => {
    const days = set.slice(a, b + 1), l = Math.min(...days.map(d => d[0])), u = Math.max(...days.map(d => d[1]))
    const from = days[0][2], to = days.at(-1)[3]
    return `${from === to ? date(from) : `${date(from)}–${date(to)}`}: ${deg(l)} to ${deg(u)} °C`
  }

  // days a to b lifted by a box centred on their bars, half a gap either side
  const box = $('.plot .lift')
  const lift = (a, b) => {
    box.hidden = a == null
    if (a == null) return
    const gap = parseFloat(getComputedStyle(chart).letterSpacing) || 0
    box.style.left = `${(a * pitch - gap / 2).toFixed(2)}px`, box.style.width = `${((b - a + 1) * pitch).toFixed(2)}px`
  }
  const pick = k => {
    at = k, lift(k, k)
    if (k == null) return read.textContent = summary, chart.setAttribute('aria-valuetext', summary)
    read.textContent = say(k, k)
    chart.setAttribute('aria-valuenow', k + 1), chart.setAttribute('aria-valuetext', read.textContent)
  }
  // the plot as wide as its bars on whole pixels, so the lines and months end where the year does
  const fig = $('.temps'), stage = fig.parentNode
  new ResizeObserver(() => {
    const room = stage.clientWidth - fig.firstElementChild.offsetWidth - (parseFloat(getComputedStyle(fig).columnGap) || 0), px = dpx()
    const n = room / 365 >= 2.4 ? 365 : 52
    if (n !== set.length) set = group(n), chart.textContent = text(), chart.setAttribute('aria-valuemax', n), pick(null)
    pitch = Math.max(2 * px, Math.floor(room / n / px) * px)
    fig.style.setProperty('--plot-w', `${(n * pitch).toFixed(2)}px`)
    fit(chart, n, n === 365 ? 0.6 : 0.5, n * pitch)
  }).observe(stage)
  chart.addEventListener('pointermove', e => {
    if (e.buttons || !getSelection().isCollapsed) return
    const b = chart.getBoundingClientRect()
    pick(Math.min(set.length - 1, Math.max(0, Math.floor((e.clientX - b.left) / pitch))))
  })
  chart.addEventListener('pointerleave', () => getSelection().isCollapsed ? pick(null) : sel())
  chart.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1, PageDown: 7, PageUp: -7 }[e.key]
    if (d) e.preventDefault(), pick(Math.min(set.length - 1, Math.max(0, (at ?? (d > 0 ? -1 : set.length)) + d)))
    else if (e.key === 'Escape') pick(null)
  })
  chart.addEventListener('blur', () => pick(null))
  // select days as text, and read what they held
  const sel = () => {
    const s = getSelection(), node = chart.firstChild
    if (!node || !s.rangeCount || s.isCollapsed || !chart.contains(s.anchorNode)) return false
    const r = s.getRangeAt(0), a = r.startContainer === node ? r.startOffset : 0, b = r.endContainer === node ? r.endOffset : node.length
    // a range bar is one code point, two UTF-16 units
    if (b > a) lift(a >> 1, (b >> 1) - 1), read.textContent = say(a >> 1, (b >> 1) - 1)
    return b > a
  }
  document.addEventListener('selectionchange', () => sel() || at != null || lift(null))

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
    return { el: h('div', { className: 'col' + (TEXT[i] ? ' is-ours' : '') }, ms, glyph, h('span', { className: 'name', textContent: name })), glyph, ms, h: 0, from: 0, to: 0 }
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
      const ms = rows[i][op]
      c.from = c.h, c.to = height(ms)
      c.ms.textContent = ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : Math.round(ms)
    })
    lanes.setAttribute('aria-label', `${OPS[op]}, ${browser}, milliseconds: ` + STACKS.map((s, i) => `${s} ${rows[i][op]}`).join(', '))
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
  // bar width: two fifths of a column, on whole device pixels
  new ResizeObserver(() => {
    const px = dpx(), F = lanes.clientHeight, w = Math.round(0.4 * lanes.clientWidth / cols.length / px) * px
    lanes.style.setProperty('--wght', Math.min(1000, w / F * 4000).toFixed(2))
  }).observe(lanes)
  show()
  // while in view and untouched, it walks through the operations
  seen(sec, on => {
    clearInterval(timer)
    if (on && auto && !still) timer = setInterval(() => { op = (op + 1) % OPS.length, show() }, 2800)
  }, 0.4)
}


/* ── renderings: the article's nine, set again, each moving as it suggests ─ */

function renderings() {
  const sec = $('#renderings'), box = $('.tiles'), moving = [], still_ = []
  box.replaceChildren(...TILES.map((t, i) => {
    const tile = h('div', { className: 'tile' })
    // the ring is a spinner: it turns, a spoke a step
    if (!t) return tile.innerHTML = ring(RING), tile.firstElementChild.classList.add('spin'), tile
    const el = h('div', { className: 'piece' })
    if (t.rond) el.style.setProperty('--rond', t.rond)
    tile.append(el)
    // the waveform plays: its played part sweeps across it
    if (!tileMotion[i]) {
      const over = h('div', { className: 'piece over' })
      tile.classList.add('playing'), tile.append(over), still_.push([el, t], [over, t])
    } else moving.push([el, tileMotion[i](t)])
    return tile
  }))
  let width = 0, time = 0
  new ResizeObserver(() => {
    width = moving[0][0].clientWidth
    still_.forEach(([el, t]) => draw(el, t, width)), moving.forEach(([el, at]) => draw(el, at(time), width))
  }).observe(box)
  animate(sec, now => { time = now / 1000, moving.forEach(([el, at]) => draw(el, at(time), width)) })
}

// each artwork a screen of its own: it follows the pointer, and drifts on its own when left alone
function artwork(sec) {
  const name = sec.dataset.piece, el = $('.piece', sec), at = motion[name](ART[name])
  const rest = ART[name]
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


/* ── get: where it is ──────────────────────────────────────────────────────── */

function get() {
  // the version this page was built with, as the package says
  soon($('#get'), () => fetch('package.json').then(r => r.json()).then(p => $('.s-version').textContent = p.version).catch(() => {}))
}

// the layout's grid, for tuning while building: the switch top right or g toggles it, ?grid opens with it
const overlay = () => {
  const root = document.documentElement, button = $('.grid-toggle')
  const show = on => { root.classList.toggle('grid-on', on), button.setAttribute('aria-pressed', on) }
  show(/[?&]grid\b/.test(location.search))
  button.addEventListener('click', () => show(!root.classList.contains('grid-on')))
  addEventListener('keydown', e => { if (e.key === 'g' && !e.target.closest('input, textarea, [contenteditable]')) show(!root.classList.contains('grid-on')) })
}


/* ── start ───────────────────────────────────────────────────────────────── */

overlay()
hero()
keys()
axes()
speed()
chat()
soon($('#renderings'), renderings)
for (const sec of $$('.work')) soon(sec, () => artwork(sec))
memo()
journey()
get()

// each slide's own motion runs when most of it is in view
const onenter = { values: values(), text: textDoc(), range: rangeChart() }
const once = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && onenter[e.target.id]?.()), { threshold: 0.45 })
$$('main > .slide').forEach(s => once.observe(s))
