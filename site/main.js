/**
 * Wavefont site. Every bar on the page is a character set in Wavefont;
 * this script only decides which characters to write.
 */
import wf, { char } from '../index.js'
import { weight } from './wave.js'
import { bench, commits } from './data.js'
import { $, $$, h, seen, noise, still, ease, swing, wander, copyable, dpx } from './dom.js'
import { chat } from './chat.js'
import { memo } from './memo.js'
import { shifts } from './shifts.js'
import { pad } from './pad.js'
import { flappy } from './flappy.js'
import { icon, tab } from './icon.js'

/** Letter the bars: one centred cell per character of s. */
const letter = (row, s) => row.replaceChildren(...Array.from(s, c => h('span', { textContent: c === ' ' ? ' ' : c })))


/* ── hero: the name, set in itself ───────────────────────────────────────── */

function hero() {
  const field = $('.mark-bars'), letters = $('.mark-letters'), box = $('.mark')
  const MAX = 20

  // the name stands as the page sets it; an edit re-letters the bars, and the tab shows them
  const sync = () => {
    let s = field.textContent.replace(/[\r\n]/g, '')
    if (s.length > MAX) {
      s = s.slice(0, MAX), field.textContent = s
      getSelection().collapse(field.firstChild, s.length)
    }
    box.style.setProperty('--n', Math.max(8, s.length))
    letter(letters, s), tab(field)
  }
  field.addEventListener('keydown', e => e.key === 'Enter' && e.preventDefault())
  field.addEventListener('input', sync)
}


/* ── 127 values: pick a bar, copy its value, character or code ──────────── */

function values() {
  const sec = $('#values'), grid = $('.grid', sec), outs = { value: $('.r-value', sec), char: $('.r-char', sec), code: $('.r-code', sec) }
  const code = v => 'U+' + (0x100 + v).toString(16).toUpperCase().padStart(4, '0')
  const cells = Array.from({ length: 128 }, (_, v) => {
    const b = h('button', { type: 'button', className: 'cell', textContent: char(v), tabIndex: -1 })
    b.style.gridArea = `${1 + (v >> 4)} / ${2 + v % 16}`
    b.setAttribute('aria-label', `Value ${v}`), b.setAttribute('aria-pressed', 'false')
    return b
  })
  // 0 and 127 stand on the lines of the first bar and the last; the readout goes under the grid's first column
  grid.replaceChildren(h('span', { className: 'edge from', textContent: '0' }), ...cells, h('span', { className: 'edge to', textContent: '127' }), $('.readout', sec))

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
  copyable($('.readout', sec), outs.char)

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


/* ── latin+ core: the keys that draw bars – a to z, A to Z, then the digits, the blocks and the rest ──────── */

// three lines of 26: the letters low to high, the capitals on up, the digits, blocks and symbols a key apart
const KEYS = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789 ▁▂▃▄▅▆▇█ |-–_.*']

function keys() {
  // a key: its bar standing on the line, its name under it; a space keeps a key's room empty
  const key = c => c === ' ' ? h('span', { className: 'k' }) : h('span', { className: 'k' }, h('b', { className: 'wf', textContent: c }), h('i', { textContent: c }))
  $('.keymap').replaceChildren(...KEYS.map(line => h('div', { className: 'line' }, ...Array.from(line, key))))
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

  // a walk through what the axes do: each move, an axis picked at random – never one a third time running – goes to
  // one of its stops other than where it is: a weight in hundreds or either end, 50 and 950; square, half round or
  // round; floor, middle or ceiling. A longer move takes longer; a new weight holds longest, a roundness less, an
  // alignment least
  const STOPS = { wght: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950], rond: [0, 50, 100], yela: [-100, 0, 100] }
  const SPAN = { wght: 900, rond: 100, yela: 200 }, HOLD = { wght: 1100, rond: 550, yela: 350 }
  const next = wander(STOPS, name => +input(name).value)
  let raf = 0, t0 = null, name, to, from = 0, move = 0
  const step = now => {
    if (t0 === null) [name, to] = next(), t0 = now, from = +input(name).value, move = 300 + 600 * Math.abs(to - from) / SPAN[name]
    set(name, from + (to - from) * swing(Math.min(1, (now - t0) / move)))
    if (now - t0 >= move + HOLD[name]) t0 = null
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
  body.textContent = para(37) + '\n\n' + para(17)

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

  // on entering, once: the page edits itself as a hand would – a few words selected and deleted, the caret gone to the
  // next paragraph, and the words typed there a character at a time. Through the text's own runs, weights kept, and
  // with a caret of its own: focusing the text for a real one would take the keys that scroll the page
  let touched = false, timer = 0, done = false
  const caret = h('span', { className: 'caret', hidden: true }), slide = doc.closest('.slide')
  slide.append(caret)
  const put = at => {
    const rg = document.createRange(), r = slide.getBoundingClientRect()
    rg.setStart(...point(body, at, true))
    const c = rg.getClientRects()[0] ?? rg.getBoundingClientRect()
    Object.assign(caret.style, { left: `${c.left - r.left}px`, top: `${c.top - r.top}px`, height: `${c.height}px` }), caret.hidden = false
  }
  const hands = () => { touched = true, clearTimeout(timer), caret.hidden = true }
  doc.addEventListener('pointerdown', hands), doc.addEventListener('keydown', hands), box.addEventListener('pointerdown', hands)
  return () => {
    const sel = getSelection()
    if (still || touched || timer || done || !matchMedia('(hover: hover)').matches || (sel.rangeCount && !sel.isCollapsed)) return
    done = true
    const words = () => [...read(body)[0].matchAll(/\p{L}+/gu)]
    // three words from the first paragraph, and what parts them from the next
    const [a, , , z] = words().slice(9, 13).map(m => m.index)
    let cut = '', weights = [], at = 0
    const steps = [
      // a selection set in editable text focuses it in some engines: let it go, so the keys still scroll the page
      [() => { sel.setBaseAndExtent(...point(body, a, true), ...point(body, z)), doc.blur() }, 1100],
      [() => {
        const [s, ws] = read(body)
        cut = s.slice(a, z), weights = ws.slice(a, z)
        write(body, s.slice(0, a) + s.slice(z), [...ws.slice(0, a), ...ws.slice(z)]), sel.removeAllRanges(), put(a), tally()
      }, 700],
      // before the fifth word of the second paragraph
      [() => { const p = read(body)[0].indexOf('\n\n'); at = words().filter(m => m.index > p)[4]?.index ?? p + 2, put(at) }, 600]
    ]
    const type = i => {
      if (touched) return
      if (i >= cut.length) return timer = setTimeout(() => { caret.hidden = true, timer = 0 }, 1600)
      const [s, ws] = read(body)
      write(body, s.slice(0, at + i) + cut[i] + s.slice(at + i), [...ws.slice(0, at + i), weights[i], ...ws.slice(at + i)]), put(at + i + 1)
      timer = setTimeout(() => type(i + 1), 55)
    }
    const next = (i = 0) => {
      if (touched) return
      if (i >= steps.length) return tally(), type(0)
      const [step, wait] = steps[i]
      step(), timer = setTimeout(() => next(i + 1), wait)
    }
    timer = setTimeout(next, 600)
  }
}


/* ── 60 fps: what drawing an hour of speech costs, as text and otherwise ── */

function speed() {
  const sec = $('#speed'), lanes = $('.lanes'), opBox = $('.ops'), browserBox = $('.browsers')
  const { ops: OPS, stacks: STACKS, text: TEXT, browsers: DATA } = bench, BROWSERS = Object.keys(DATA)
  // milliseconds on a log scale: 0.1 on the floor, 1000 at the top
  const height = ms => ms ? Math.min(1, Math.max(0, (Math.log10(ms) + 1) / 4)) : 0
  const num = ms => ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : String(Math.round(ms))

  // a column a way, for one operation, its time standing on its bar: the first ours, the font's other ways text too
  const cols = STACKS.map((name, i) => {
    const glyph = h('span', { className: 'glyph wf' }), ms = h('span', { className: 'ms' })
    return { el: h('div', { className: 'col' + (i ? '' : ' is-ours') + (TEXT[i] ? ' is-text' : '') }, ms, glyph, h('span', { className: 'name', textContent: name })), glyph, ms, h: 0, from: 0, to: 0 }
  })
  lanes.replaceChildren(...cols.map(c => c.el))

  let op = 0, browser = BROWSERS[0], auto = true, raf = 0, t0 = 0, timer = 0
  const tween = now => {
    const k = still ? 1 : ease(Math.min(1, (now - t0) / 650))
    for (const c of cols) {
      c.h = c.from + (c.to - c.from) * k
      c.glyph.textContent = c.h ? char(100 * c.h) : ''
      c.el.style.setProperty('--h', c.h.toFixed(4))
    }
    if (k < 1) raf = requestAnimationFrame(tween)
  }
  const show = () => {
    const rows = DATA[browser]
    cols.forEach((c, i) => { const ms = rows[i][op]; c.from = c.h, c.to = height(ms), c.ms.textContent = num(ms) })
    lanes.setAttribute('aria-label', `${OPS[op]}, ${browser}, milliseconds: ` + STACKS.map((s, i) => `${s} ${rows[i][op]}`).join(', '))
    for (const b of opBox.children) b.setAttribute('aria-checked', b.textContent === OPS[op])
    for (const b of browserBox.children) b.setAttribute('aria-checked', b.textContent === browser)
    cancelAnimationFrame(raf), t0 = performance.now(), raf = requestAnimationFrame(tween)
  }
  const tabs = (box, names, pick) => box.replaceChildren(...names.map((n, i) => {
    const b = h('button', { type: 'button', textContent: n })
    b.setAttribute('role', 'radio')
    b.addEventListener('click', () => { auto = false, clearInterval(timer), pick(i), show() })
    return b
  }))
  tabs(opBox, OPS, i => op = i)
  tabs(browserBox, BROWSERS, i => browser = BROWSERS[i])
  // bars a quarter of a way's column wide: whole device pixels, whole font units
  new ResizeObserver(() => {
    const px = dpx(), F = lanes.clientHeight
    if (F) lanes.style.setProperty('--wght', weight(Math.round(lanes.clientWidth / STACKS.length / 4 / px) * px, F))
  }).observe(lanes)
  show()
  // while in view and untouched, it walks through the operations
  seen(sec, on => {
    clearInterval(timer)
    if (on && auto && !still) timer = setInterval(() => { op = (op + 1) % OPS.length, show() }, 2800)
  }, 0.4)
}


/* ── journey: the years in a line, each with its months' commits ───────── */

function journey() {
  const list = $('.milestones'), { from: [y0, m0], months } = commits, top = Math.sqrt(Math.max(...months))
  // a bar per month, square-rooted so quiet months still show; a month with none is a dot, one before the first nothing
  const bar = n => n ? wf(8 + 92 * Math.sqrt(n) / top) : wf(1)
  const rows = $$('li', list).map(li => {
    const y = +li.querySelector('time').dateTime.slice(0, 4), at = (y - y0) * 12 - (m0 - 1)
    const el = h('div', { className: 'months wf', textContent: Array.from({ length: 12 }, (_, m) => at + m < 0 ? ' ' : at + m < months.length ? bar(months[at + m]) : '').join('') })
    el.setAttribute('aria-hidden', 'true'), li.append(el)
    return el
  })
  // each year's twelve months centred on its year, from halfway to the year before to halfway to the next, so a month
  // is nearest its own year; one weight for every bar, half the pitch of the tightest year, on whole device pixels
  const place = () => {
    const px = dpx(), F = parseFloat(getComputedStyle(rows[0]).fontSize), c = rows.map(el => { const li = el.parentNode, t = li.firstElementChild; return li.offsetTop + t.offsetTop + t.offsetHeight / 2 })
    const n = c.length, edge = k => k <= 0 ? c[0] - (c[1] - c[0]) / 2 : k >= n ? c[n - 1] + (c[n - 1] - c[n - 2]) / 2 : (c[k - 1] + c[k]) / 2
    const P = rows.map((_, k) => (edge(k + 1) - edge(k)) / 12)
    if (!F || !P[0]) return
    const wght = weight(Math.max(px, Math.round(0.5 * Math.min(...P) / px) * px), F)
    list.style.setProperty('--wght', wght)
    rows.forEach((el, k) => Object.assign(el.style, { top: `${edge(k) - el.parentNode.offsetTop}px`, height: `${12 * P[k]}px`, letterSpacing: `${(P[k] - wght * F / 4000).toFixed(4)}px` }))
  }
  new ResizeObserver(place).observe(list), document.fonts.ready.then(place)
}


// the layout's grid, for tuning while building: g toggles it, ?grid opens with it
const overlay = () => {
  const root = document.documentElement, show = on => root.classList.toggle('grid-on', on)
  show(/[?&]grid\b/.test(location.search))
  addEventListener('keydown', e => { if (e.key === 'g' && !e.target.closest('input, textarea, [contenteditable]')) show(!root.classList.contains('grid-on')) })
}


/* ── start ───────────────────────────────────────────────────────────────── */

overlay()
icon()
hero()
keys()
axes()
shifts()
speed()
chat()
memo()
journey()
pad()
flappy()

// the slide in view is the address's hash, so a reload or a link lands where you are; the first is the bare address
const where = new IntersectionObserver(es => es.forEach(e => e.isIntersecting &&
  history.replaceState(null, '', e.target.id === 'wavefont' ? location.pathname + location.search : `#${e.target.id}`)), { threshold: 0.5 })
$$('main > .slide[id]').forEach(s => where.observe(s))

// a slide out of view holds its CSS animations: they would still cost frames there. In view is a pixel in, not
// just touching the edge
const view = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('off', !e.isIntersecting)), { rootMargin: '-1px' })
$$('main > .slide').forEach(s => view.observe(s))

// each slide's own motion runs when most of it is in view
const onenter = { values: values(), text: textDoc() }
const once = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && onenter[e.target.id]?.()), { threshold: 0.45 })
$$('main > .slide').forEach(s => once.observe(s))
