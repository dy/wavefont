/**
 * Wavefont site. Every bar on the page is a character set in Wavefont;
 * this script only decides which characters to write.
 */
import wf, { char } from '../index.js'
import { fit, weight } from './wave.js'
import { bench, commits } from './data.js'
import { $, $$, h, soon, seen, noise, still, ease, swing } from './dom.js'
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

  // a walk through what the axes do: weight by weight, the extremes first and closing in – 100, 900, 200, 800, …, 500;
  // at each weight, square, half round and round, there and back in turn; at each roundness, the same three moves:
  // down to the floor, up to the ceiling, back to the middle. Each move changes one axis, a longer one taking longer;
  // a new weight holds longest, a new roundness less, an alignment least. Twice through the weights, the roundness
  // comes back where it began
  const WGHT = [100, 900, 200, 800, 300, 700, 400, 600, 500], ROND = [0, 50, 100], YELA = [-100, 100, 0]
  const INTO = [['wght', 100]], ROUND = []
  let r = 0
  for (const [i, w] of [...WGHT, ...WGHT].entries()) {
    if (i) ROUND.push(['wght', w])
    for (const rv of i % 2 ? [...ROND].reverse() : ROND) {
      if (rv !== r) ROUND.push(['rond', rv]), r = rv
      for (const yv of YELA) ROUND.push(['yela', yv])
    }
  }
  ROUND.push(['wght', 100])
  const SPAN = { wght: 950, rond: 100, yela: 200 }, HOLD = { wght: 1100, rond: 550, yela: 250 }
  let raf = 0, k = 0, t0 = null, from = 0, move = 0
  const step = now => {
    const [name, to] = k < INTO.length ? INTO[k] : ROUND[(k - INTO.length) % ROUND.length]
    if (t0 === null) t0 = now, from = +input(name).value, move = 300 + 600 * Math.abs(to - from) / SPAN[name]
    set(name, from + (to - from) * swing(Math.min(1, (now - t0) / move)))
    if (now - t0 >= move + HOLD[name]) k++, t0 = null
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


/* ── 60 fps: what drawing an hour of speech costs, as text and otherwise ── */

function speed() {
  const sec = $('#speed'), lanes = $('.lanes'), multi = $('.multiples'), table = $('.bench'), opBox = $('.ops'), browserBox = $('.browsers')
  const { ops: OPS, stacks: STACKS, text: TEXT, browsers: DATA } = bench, BROWSERS = Object.keys(DATA)
  // milliseconds on a log scale: 0.1 on the floor, 1000 at the top
  const height = ms => ms ? Math.min(1, Math.max(0, (Math.log10(ms) + 1) / 4)) : 0
  const num = ms => ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : String(Math.round(ms))
  const ours = i => TEXT[i] ? 'is-ours' : ''
  const role = (el, r) => (el.setAttribute('role', r), el)

  // 1: a column a way, for one operation
  const cols = STACKS.map((name, i) => {
    const glyph = h('span', { className: 'glyph wf' }), ms = h('span', { className: 'ms' })
    return { el: h('div', { className: 'col ' + ours(i) }, ms, glyph, h('span', { className: 'name', textContent: name })), glyph, ms, h: 0, from: 0, to: 0 }
  })
  lanes.replaceChildren(...cols.map(c => c.el))
  // 2: every operation, its four bars in the same order
  const bars = OPS.map(() => STACKS.map((_, i) => ({ glyph: h('span', { className: 'glyph wf ' + ours(i) }), h: 0, from: 0, to: 0 })))
  multi.replaceChildren(...OPS.map((op, j) => h('div', { className: 'group' }, ...bars[j].map(b => b.glyph), h('span', { className: 'name', textContent: op }))))
  $('.legend').replaceChildren(...STACKS.map((s, i) => h('span', { className: ours(i) }, h('span', { className: 'wf', textContent: char(100) }), s)))
  // 3: a table, a row a way, a column an operation; a time after its bar
  const cells = STACKS.map(() => OPS.map(() => {
    const b = h('span', { className: 'wf' }), n = h('span')
    b.setAttribute('aria-hidden', 'true')
    return { el: role(h('div', {}, b, n), 'cell'), b, n }
  }))
  table.replaceChildren(
    role(h('div', {}, role(h('div'), 'columnheader'), ...OPS.map(op => role(h('div', { textContent: op }), 'columnheader'))), 'row'),
    ...STACKS.map((s, i) => role(h('div', { className: ours(i) }, role(h('div', { textContent: s }), 'rowheader'), ...cells[i].map(c => c.el)), 'row'))
  )

  let op = 0, browser = BROWSERS[0], auto = true, raf = 0, t0 = 0, timer = 0
  const moving = [...cols, ...bars.flat()]
  const tween = now => {
    const k = still ? 1 : ease(Math.min(1, (now - t0) / 650))
    for (const c of moving) {
      c.h = c.from + (c.to - c.from) * k
      c.glyph.textContent = c.h ? char(100 * c.h) : ''
      c.el?.style.setProperty('--h', c.h.toFixed(4))
    }
    if (k < 1) raf = requestAnimationFrame(tween)
  }
  const show = () => {
    const rows = DATA[browser]
    cols.forEach((c, i) => { const ms = rows[i][op]; c.from = c.h, c.to = height(ms), c.ms.textContent = num(ms) })
    bars.forEach((bs, j) => bs.forEach((b, i) => { b.from = b.h, b.to = height(rows[i][j]) }))
    cells.forEach((cs, i) => cs.forEach((c, j) => {
      const ms = rows[i][j]
      c.b.textContent = char(Math.round(100 * height(ms))), c.n.textContent = num(ms), c.el.classList.toggle('over', ms > 1000 / 60)
    }))
    const said = j => STACKS.map((s, i) => `${s} ${rows[i][j]}`).join(', ')
    lanes.setAttribute('aria-label', `${OPS[op]}, ${browser}, milliseconds: ${said(op)}`)
    multi.setAttribute('aria-label', `${browser}, milliseconds: ` + OPS.map((o, j) => `${o}: ${said(j)}`).join('; '))
    for (const b of opBox.children) b.setAttribute('aria-checked', b.textContent === OPS[op])
    for (const b of browserBox.children) b.setAttribute('aria-checked', b.textContent === browser)
    cancelAnimationFrame(raf), t0 = performance.now(), raf = requestAnimationFrame(tween)
  }
  const tabs = (box, names, pick) => box.replaceChildren(...names.map((n, i) => {
    const b = role(h('button', { type: 'button', textContent: n }), 'radio')
    b.addEventListener('click', () => { auto = false, clearInterval(timer), pick(i), show() })
    return b
  }))
  tabs(opBox, OPS, i => op = i)
  tabs(browserBox, BROWSERS, i => browser = BROWSERS[i])
  // bar width: a quarter of a way's column, half of a bar's place in a group; whole device pixels, whole font units
  const thick = (el, n, fill) => new ResizeObserver(() => {
    const px = dpx(), F = el.clientHeight
    if (F) el.style.setProperty('--wght', weight(Math.round(fill * el.clientWidth / n / px) * px, F))
  }).observe(el)
  thick(lanes, STACKS.length, 0.25), thick(multi, OPS.length * STACKS.length, 0.5)
  show()
  // while in view and untouched, it walks through the operations, or, where they're all shown, the browsers
  seen(sec, on => {
    clearInterval(timer)
    if (on && auto && !still) timer = setInterval(() => {
      if (opBox.offsetParent) op = (op + 1) % OPS.length
      else browser = BROWSERS[(BROWSERS.indexOf(browser) + 1) % BROWSERS.length]
      show()
    }, 2800)
  }, 0.4)
}


// a slide offering layouts to choose from: its switch sets which
const variants = () => $$('.variants').forEach(box => {
  const sec = box.closest('.slide'), buttons = $$('button', box)
  buttons.forEach(b => b.addEventListener('click', () => {
    sec.dataset.variant = b.textContent, buttons.forEach(x => x.setAttribute('aria-pressed', x === b))
  }))
})


/* ── journey: ten years of commits, as a recording ───────────────────────── */

function journey() {
  const el = $('.commits'), { months } = commits, top = Math.sqrt(Math.max(...months))
  // a bar per month, square-rooted so quiet months still show; a month with none is a dot
  el.textContent = wf(months.map(n => n ? 8 + 92 * Math.sqrt(n) / top : 1))
  // the versions and the years start at their months' bars
  new ResizeObserver(() => el.parentNode.style.setProperty('--pitch', `${fit(el, months.length, 0.5)}px`)).observe(el)
}


/* ── get: bars of your own, and where the font is ────────────────────────── */

/** A line of bars across the screen to draw on with a pencil; copy takes them as text. */
function pad() {
  const line = $('.pad-bars'), btn = $('.pad-copy'), N = 48
  // to begin with, a word of speech: it swells and fades
  const values = Array.from({ length: N }, (_, i) => Math.round(4 + 88 * Math.sin(Math.PI * (i + 0.5) / N) ** 1.2 * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.9)))))
  let P = 0
  const show = () => { line.textContent = wf(values), P = fit(line, N, 0.5) }
  new ResizeObserver(show).observe(line)
  // the pencil: the bar under its tip as high as the tip is over the line's foot; a stroke fills the bars it passes
  // between two moves
  let last = null
  const at = e => {
    const r = line.getBoundingClientRect()
    return [Math.min(N - 1, Math.max(0, Math.floor((e.clientX - r.left) / P))), Math.min(100, Math.max(0, Math.round((r.bottom - e.clientY) / r.height * 100)))]
  }
  const stroke = ([i, v]) => {
    const [i0, v0] = last ?? [i, v]
    for (let k = Math.min(i0, i); k <= Math.max(i0, i); k++) values[k] = i === i0 ? v : Math.round(v0 + (v - v0) * (k - i0) / (i - i0))
    last = [i, v], show()
  }
  line.addEventListener('pointerdown', e => { line.setPointerCapture(e.pointerId), last = null, stroke(at(e)) })
  line.addEventListener('pointermove', e => line.hasPointerCapture(e.pointerId) && stroke(at(e)))
  line.addEventListener('pointerup', () => last = null)
  // a tick for a moment when copied; the title says if it wasn't
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(wf(values)), btn.classList.add('is-done') } catch { btn.title = 'Copy failed' }
    setTimeout(() => (btn.classList.remove('is-done'), btn.title = 'Copy the bars as text'), 1200)
  })
}

function get() {
  // the version this page was built with, as the package says
  soon($('#get'), () => fetch('package.json').then(r => r.json()).then(p => $('.s-version').textContent = p.version).catch(() => {}))
  pad()
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
variants()
hero()
keys()
axes()
chat()
memo()
speed()
journey()
get()

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
