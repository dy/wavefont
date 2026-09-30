import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// AudioBuffer is a browser API; synthesis only constructs one and reads its channel back
globalThis.AudioBuffer ??= class {
  constructor({ length, sampleRate }) { this.length = length, this.sampleRate = sampleRate, this.duration = length / sampleRate, this.data = new Float32Array(length) }
  copyToChannel(d) { this.data.set(d) }
  getChannelData() { return this.data }
}
const { levels, voice, wav } = await import('./sound.js')
test('levels: dB below the loudest slice over the range', () => {
  const n = 4000, data = new Float32Array(2 * n)
  for (let i = 0; i < n; i++) data[i] = Math.sin(i / 3), data[n + i] = 0.5 * Math.sin(i / 3)
  const [loud, half] = levels(data, 2, 42)
  assert.equal(loud, 1)
  // half amplitude is 20·log10(0.5) = −6.02 dB
  assert.ok(Math.abs(half - (1 - 6.0206 / 42)) < 1e-3, `${half}`)
  assert.deepEqual([...levels(new Float32Array(100), 4)], [0, 0, 0, 0])
})

test('voice: same seed, same take; normalized to 0.7', () => {
  const a = voice(1, 2).getChannelData(0), b = voice(1, 2).getChannelData(0)
  assert.deepEqual(a, b)
  assert.ok(Math.abs(Math.max(...a.map(Math.abs)) - 0.7) < 1e-6)
  assert.ok(a.every(Number.isFinite))
})

test('wav: 16-bit PCM mono, header as the RIFF WAVE spec lays it out', async () => {
  const data = Float32Array.from([0, 0.5, -0.5, 1, -1, 2])
  const b = new AudioBuffer({ length: data.length, sampleRate: 8000 })
  b.copyToChannel(data, 0)
  const v = new DataView(await wav(b).arrayBuffer()), ascii = (at, n) => String.fromCharCode(...new Uint8Array(v.buffer, at, n))
  assert.equal(v.byteLength, 44 + 2 * data.length)
  assert.equal(ascii(0, 4), 'RIFF'), assert.equal(v.getUint32(4, true), 36 + 2 * data.length)
  assert.equal(ascii(8, 8), 'WAVEfmt '), assert.equal(v.getUint32(16, true), 16)
  assert.equal(v.getUint16(20, true), 1, 'PCM'), assert.equal(v.getUint16(22, true), 1, 'mono')
  assert.equal(v.getUint32(24, true), 8000), assert.equal(v.getUint32(28, true), 16000, 'byte rate')
  assert.equal(v.getUint16(32, true), 2, 'block align'), assert.equal(v.getUint16(34, true), 16, 'bits')
  assert.equal(ascii(36, 4), 'data'), assert.equal(v.getUint32(40, true), 2 * data.length)
  assert.deepEqual(Array.from({ length: data.length }, (_, i) => v.getInt16(44 + 2 * i, true)), [0, 16383, -16383, 32767, -32767, 32767], 'clipped past ±1')
})

const { bench, commits } = await import('./data.js')

test('commits: one count per month, August 2016 to September 2026', () => {
  assert.deepEqual(commits.from, [2016, 8])
  assert.equal(commits.months.length, (2026 - 2016) * 12 + 9 - 8 + 1)
  assert.ok(commits.months.every(n => Number.isInteger(n) && n >= 0))
  assert.ok(commits.months[0] > 0 && commits.months.at(-1) > 0, 'first and last month have commits')
})

test('bench: every stack and op in each browser, wavefont ahead of its marks, and of an element per bar on every edit', () => {
  // wavearea bench/render, wavefont 3.8.2 plain values (values.window) and with shift marks (font.window), medians:
  // see data.js. Not select against html: dragging a selection, WebKit paints it over text slower than over elements
  // (12 ms a frame against 6.5)
  const { ops, stacks, text, browsers } = bench
  assert.deepEqual(stacks, ['wavefont', 'wavefont marks', 'svg', 'html', 'canvas'])
  assert.deepEqual(text, stacks.map(s => s.startsWith('wavefont')), 'text: the font\'s ways, and only them')
  const marks = stacks.indexOf('wavefont marks'), html = stacks.indexOf('html')
  for (const [name, rows] of Object.entries(browsers)) {
    assert.equal(rows.length, stacks.length, name)
    rows.forEach(r => assert.ok(r.length === ops.length && r.every(ms => ms > 0), name))
    rows[0].forEach((ms, k) => assert.ok(ms < rows[marks][k], `${name} ${ops[k]}: wavefont ${ms}, marks ${rows[marks][k]}`))
    rows[0].forEach((ms, k) => ops[k] === 'select' || assert.ok(ms < rows[html][k], `${name} ${ops[k]}: wavefont ${ms}, html ${rows[html][k]}`))
  }
})

const { weight, valueOf, lift } = await import('./wave.js')

test('valueOf: every character the font maps, the bar it draws', async () => {
  // the font's own cmap, format 4 as the OpenType spec lays it out: a character draws value v when it maps to the
  // glyph U+0100 + v maps to, and nothing when it maps to the space's
  const b = await readFile(new URL('../fonts/variable/Wavefont[ROND,YELA,wght].ttf', import.meta.url))
  const d = new DataView(b.buffer, b.byteOffset, b.byteLength), u16 = o => d.getUint16(o), u32 = o => d.getUint32(o)
  let at = 0
  for (let i = 0; i < u16(4); i++) if (u32(12 + 16 * i) === 0x636d6170) at = u32(20 + 16 * i)
  let s = 0
  for (let i = 0; i < u16(at + 2); i++) if (u16(at + 4 + 8 * i) === 3 && u16(at + 6 + 8 * i) === 1) s = at + u32(at + 8 + 8 * i)
  assert.equal(u16(s), 4)
  const seg = u16(s + 6), ends = s + 14, starts = ends + seg + 2, deltas = starts + seg, ranges = deltas + seg, map = new Map()
  for (let i = 0; i < seg; i += 2) for (let c = u16(starts + i); c <= u16(ends + i) && c < 0xffff; c++) {
    const ro = u16(ranges + i), g = ro ? u16(ranges + i + ro + 2 * (c - u16(starts + i))) : c
    map.set(c, ro && !g ? 0 : (g + u16(deltas + i)) & 0xffff)
  }
  assert.ok(map.size > 300, `${map.size} characters`)
  for (const [k, g] of map) {
    const c = String.fromCharCode(k), v = valueOf(c)
    if (/\p{M}/u.test(c)) continue // marks shift the bar before them
    assert.equal(v === undefined ? map.get(32) : map.get(0x100 + v), g, `U+${k.toString(16).padStart(4, '0')} ${c}: ${v}`)
  }
  // a character the font leaves out draws nothing either
  assert.equal(valueOf('ж'), undefined), assert.equal(valueOf(' '), undefined)
})

test('lift: a bar x of the way up its value – the bar of that share, drawn by the font\'s own character – and itself when all the way up or where it draws none', () => {
  // the keys the site sets: a–z, A–Z, the digits, the blocks, | and the floor's marks; valueOf is the bar a character
  // draws, held to the font's cmap above
  for (const c of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▁▂▃▄▅▆▇█|-–_.*') {
    const v = valueOf(c)
    assert.equal(lift(c, 1), c), assert.equal(lift(c, 1.5), c)
    for (const x of [0, 0.1, 0.25, 0.5, 0.75, 0.99]) assert.equal(valueOf(lift(c, x)), Math.round(v * x), `${c} at ${x}`)
    assert.equal(valueOf(lift(c, 0)), 0, `${c} on the floor`)
  }
  // a bar the font draws nothing for, or moves: as it is
  for (const c of [' ', 'ж', '́']) assert.equal(lift(c, 0.4), c)
  // below the floor is the floor
  assert.equal(valueOf(lift('z', -1)), 0)
  // the hero's name: its bars 96, 0, 42, 8, 10, 28, 26, 38 – W the capitals' 52 + 2 × 22, then twice a letter's place from
  // a – half way up at half of each, and the letters themselves at the top
  const name = x => Array.from('Wavefont', c => lift(c, x)).join('')
  assert.deepEqual([...name(1)].map(valueOf), [96, 0, 42, 8, 10, 28, 26, 38]), assert.equal(name(1), 'Wavefont')
  assert.deepEqual([...name(0.5)].map(valueOf), [48, 0, 21, 4, 5, 14, 13, 19])
  assert.deepEqual([...name(0)].map(valueOf), Array(8).fill(0))
})

const { N, line, peaks, place } = await import('./icon.js')

test('line: a bar a character, [foot, top] up its line; marks lift the bar before them; a blank holds a place, a new line none', async () => {
  const { char, shift } = await import('../index.js'), { range } = await import('./shifts.js')
  // on the floor, in the middle, from the ceiling
  assert.deepEqual(line(char(40)), [[0, 40]]), assert.deepEqual(line(char(40), 0), [[30, 70]]), assert.deepEqual(line(char(40), 1), [[60, 100]])
  assert.deepEqual(line('Wa |\nb'), [[0, 96], [0, 0], null, [0, 100], [0, 2]])
  // the site's own ranges, a bar lifted by its marks: back as they were written, lifts up to 100
  for (let lo = 0; lo <= 100; lo += 7) for (let hi = lo + 1; hi <= lo + 127; hi += 11) {
    const bars = line(range(lo, hi))
    assert.ok(bars.length === 1 && bars[0][0] === lo && bars[0][1] === hi, `${lo}–${hi}: ${bars}`)
  }
  assert.deepEqual(line(char(30) + shift(-13)), [[-13, 17]])
  // a mark with no bar before it lifts nothing, and any other mark is no bar
  assert.deepEqual(line(shift(10) + ' ' + shift(10) + char(5) + '̈'), [null, [0, 5]])
})

test('place: a bar where it stands on its line, a unit tall at least and kept in the room; a blank, nothing', () => {
  const near = (a, b) => Math.abs(a - b) < 1e-9
  for (const v of [0, 1, 50, 100, 127]) {
    const h = Math.max(1, 12 * Math.min(100, v) / 100), [[, yb, , hb], [, yc, , hc], [, yt, , ht]] = place([[0, v], [50 - v / 2, 50 + v / 2], [100 - v, 100]])
    assert.ok(near(hb, h) && near(hc, h) && near(ht, h), `${v}: height`)
    assert.ok(near(yb + hb, 14) && near(yc + hc / 2, 8) && near(yt, 2), `${v}: on the floor, in the middle, from the ceiling`)
  }
  // lifted: from 30 to 70 of the line's 12 units over the floor at 14
  const [[, y, , h]] = place([[30, 70]])
  assert.ok(near(y, 14 - 8.4) && near(y + h, 14 - 3.6))
  // past the ceiling or under the floor, kept in the room
  assert.deepEqual(place([[90, 130], [-20, -5]]).map(([, y, , h]) => [+y.toFixed(9), +h.toFixed(9)]), [[2, 1.2], [13, 1]])
  assert.deepEqual(place([null]), [null])
  // any number: evenly apart, 3/5 of the pitch wide, centred in the room from 0.5 to 15.5
  for (let n = 1; n <= N; n++) {
    const r = place(Array(n).fill([0, 50])), p = 15 / Math.max(3, n)
    r.forEach(([x, , w], i) => assert.ok(near(w, 0.6 * p) && (!i || near(x - r[i - 1][0], p)), `${n} bars: ${i}`))
    assert.ok(r[0][0] >= 0.5 && r.at(-1)[0] + r.at(-1)[2] <= 15.5 && near(r[0][0] + r.at(-1)[0] + r.at(-1)[2], 16), `${n} bars: room`)
  }
})

test('place: the page\'s icon before the script runs is the name\'s bars as the script draws them', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  // the name stands on the floor, as .mark-bars sets it
  const name = html.match(/<div class="mark-bars[^>]*>([^<]*)</)[1], svg = html.match(/<link rel="icon" href="([^"]*)"/)[1]
  const rects = [...svg.matchAll(/<rect x='([\d.]+)' y='([\d.]+)' width='([\d.]+)' height='([\d.]+)'\/>/g)].map(m => m.slice(1).map(Number))
  assert.deepEqual(rects, place(peaks(line(name))).map(r => r.map(v => +v.toFixed(2))))
})

test('hero: the name before the script runs is lettered as the script letters it, a cell a bar, in fonts that wait', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8'), css = await readFile(new URL('./main.css', import.meta.url), 'utf8')
  const name = html.match(/<div class="mark-bars[^>]*>([^<]*)</)[1], cells = html.match(/<div class="mark-letters"[^>]*>(.*?)<\/div>/)[1]
  assert.equal(cells, [...name].map(c => `<span>${c}</span>`).join(''))
  // no stand-in font shows first: the letters' fonts and the bars' block until they're in
  assert.match(html.match(/fonts\.googleapis\.com\/css2[^"]*/)[0], /display=block/)
  assert.match(css, /font-display: block/)
  // and the bars don't show at their height before the script sets them at the floor to rise, where there's a script
  // to (CSS Conditional Rules 5: the scripting media feature)
  assert.match(css, /@media \(scripting: enabled\) \{ \.mark:not\(\.is-set\) \.mark-bars \{ color: transparent; \} \}/)
})

test('wght-bars: the lead-in slides\' bars in one weight – 400 on a phone, wider with the screen, 600 at most – in whole font units, as the keys and the values set them', async () => {
  const css = await readFile(new URL('./main.css', import.meta.url), 'utf8')
  // :root's, the phone's, then a step at each min-width up (main.css)
  const ws = [...css.matchAll(/--wght-bars: (\d+);/g)].map(m => +m[1])
  assert.equal(ws[0], 400), assert.equal(ws.at(-1), 600)
  // a weight is an advance of wght/4 font units, and Firefox rounds variable advances to whole units: multiples of 4
  // (weight() above)
  ws.forEach((w, i) => assert.ok(w % 4 === 0 && (!i || w > ws[i - 1]), `${w}`))
  assert.match(css, /\.keymap \{ --wght: var\(--wght-bars\);/)
  assert.match(css, /\.grid \.cell \{\s*--wght: var\(--wght-bars\);/)
})

test('journey: a row a year, each from the first commit\'s to the last\'s, in order and as its time says; a year that brought something the month it did, one with commits', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8'), { from: [y0, m0], months } = commits
  const list = html.match(/<ol class="milestones">(.*?)<\/ol>/s)[1], rows = [...list.matchAll(/<li><time datetime="(\d{4})(?:-(\d\d))?">(\d{4})<\/time>(<span>)?/g)]
  assert.equal(rows.length, [...list.matchAll(/<li>/g)].length, 'every row a year')
  const last = y0 + Math.floor((m0 - 1 + months.length - 1) / 12)
  assert.deepEqual(rows.map(r => +r[3]), Array.from({ length: last - y0 + 1 }, (_, k) => y0 + k))
  for (const [, at, month, year, said] of rows) {
    assert.equal(at, year)
    assert.equal(!!month, !!said, `${year}: a month with what it brought, none without`)
    if (month) assert.ok(months[(year - y0) * 12 + (month - m0)] > 0, `${year}-${month}: commits that month`)
  }
})

test('peaks: up to N bars as they are; more, N, each what its share covers, lowest foot to highest top', () => {
  const bars = Array.from({ length: N }, (_, i) => [0, i])
  assert.equal(peaks(bars), bars), assert.deepEqual(peaks([]), [])
  // 13 into 6: shares of 2, 2, 2, 2, 2 and 3; a blank adds nothing, a share of blanks is one
  const b = [[0, 5], [0, 1], [10, 20], [30, 40], null, [3, 3], null, null, [50, 50], null, [0, 9], [2, 2], [-5, 9]]
  assert.deepEqual(peaks(b), [[0, 5], [10, 40], [3, 3], null, [50, 50], [-5, 9]])
  // every bar is in a share: the lowest foot and the highest top of all are kept, and each foot and top is a bar's
  const inked = bs => bs.filter(Boolean)
  for (let n = N + 1; n < 300; n += 7) {
    const all = Array.from({ length: n }, (_, i) => i % 11 ? [(i * 37 + n) % 90, (i * 37 + n) % 90 + (i * 53) % 40] : null), out = peaks(all)
    assert.equal(out.length, N)
    assert.equal(Math.min(...inked(out).map(b => b[0])), Math.min(...inked(all).map(b => b[0])), `${n}: lowest foot`)
    assert.equal(Math.max(...inked(out).map(b => b[1])), Math.max(...inked(all).map(b => b[1])), `${n}: highest top`)
    assert.ok(inked(out).every(b => all.some(x => x?.[0] === b[0]) && all.some(x => x?.[1] === b[1])), `${n}: a bar's`)
  }
})

test('weight: whole font units, the nearest to the width asked', () => {
  // readme, variable axes: wght 100 ≙ 0.025em, 400 ≙ 0.1em, 1000 ≙ 0.25em – an advance of wght/4 units of 1000;
  // Firefox rounds variable advances to whole units, so weights are multiples of 4
  assert.equal(weight(0.025 * 40, 40), 100), assert.equal(weight(0.1 * 40, 40), 400), assert.equal(weight(0.25 * 40, 40), 1000)
  for (const F of [13, 41.6, 120, 367.5]) for (let w = 0.25; w < 0.25 * F; w *= 1.37) {
    const wg = weight(w, F)
    assert.ok(wg % 4 === 0 && wg >= 4 && wg <= 1000, `${w} px at ${F} px: ${wg}`)
    assert.ok(wg === 4 || Math.abs(wg / 4000 * F - w) <= F / 2000 + 1e-9, `${w} px at ${F} px: within half a unit`)
  }
  assert.equal(weight(0, 40), 4, 'at least the thinnest bar'), assert.equal(weight(99, 40), 1000, 'at most the widest')
})

const { range, spell, wave, order, lead } = await import('./shifts.js')
const { char, shift } = await import('../index.js')

test('range: a bar from lo to hi is the value hi − lo and its marks lifting it lo, or lowering it; none, a space', () => {
  // readme: U+0301 lifts a step, U+0302 ten, 10-step marks first; U+0300 lowers a step, U+030C ten
  assert.equal(range(23, 53), char(30) + '\u0302\u0302\u0301\u0301\u0301')
  assert.equal(range(0, 40), char(40))
  assert.equal(range(96, 97), char(1) + shift(96))
  // under the floor, as the pencil draws it: a bar hanging from the line
  assert.equal(range(-13, 0), char(13) + '\u030C\u0300\u0300\u0300'), assert.equal(range(-40, -10), char(30) + shift(-40))
  // no bar: a space, blank at a bar's advance – U+0100, value 0, still inks a mark on the floor
  assert.equal(range(96, 96), ' '), assert.equal(range(0, 0), ' ')
})

test('lead: a run of its own starts with one of the font\'s marks – no ink, no room – and the bar after it is as it was', () => {
  // WebKit moves a whole run whose first glyph the font moves; the font's marks, U+0300 U+0301 U+0302 U+030C, are its
  // only glyphs with no advance (fonts/variable, hmtx) and move nothing with no bar before them
  const bar = range(23, 53), t = lead(bar)
  assert.equal(t.length, bar.length + 1), assert.equal(t.slice(1), bar)
  assert.ok(['\u0300', '\u0301', '\u0302', '\u030C'].includes(t[0]))
})

test('spell: a bar\'s characters as code points, a run of one mark counted', () => {
  assert.equal(spell(32, 23), 'U+0120 U+0302 ×2 U+0301 ×3')
  assert.equal(spell(30, -13), 'U+011E U+030C U+0300 ×3')
  assert.equal(spell(127, 0), 'U+017F')
  assert.equal(spell(8, 10), 'U+0108 U+0302')
  // as many marks as shift() writes, of each kind
  for (const s of [1, 9, 10, 11, 57, 100, -1, -46, -100]) {
    const marks = shift(s), count = c => [...marks].filter(m => m === String.fromCharCode(c)).length
    const said = Object.fromEntries(spell(0, s).split(' U+').slice(1).map(p => { const [c, n] = p.split(' ×'); return [parseInt(c, 16), +(n ?? 1)] }))
    for (const c of [0x300, 0x301, 0x302, 0x30C]) assert.equal(said[c] ?? 0, count(c), `${s}: U+0${c.toString(16)}`)
  }
})

test('spell: the longest code points the waves\' readout can show are the characters its one line is sized for', async () => {
  // a bar anywhere the marks take it: 0 to 127, lifted or lowered up to 100
  let most = 0
  for (let v = 0; v <= 127; v++) for (let s = -100; s <= 100; s++) most = Math.max(most, spell(v, s).length)
  assert.equal(most, 26)
  // the readout's --ems: the character with its marks, the code points, and the two gaps (main.css)
  const css = await readFile(new URL('./main.css', import.meta.url), 'utf8')
  assert.match(css, new RegExp(`\\.shifts \\.readout \\{ --ems: calc\\(${most + 1} \\* 0\\.632 \\+ 2 \\* 1\\.2\\)`))
})

const { wander, noise, rise, rising, seen, soon, ease } = await import('./dom.js')

// a clock of the test's own, for what runs on frames: frame(ms) runs the frame last asked for, at ms; asked says if
// there is one
const frames = () => {
  const raf = globalThis.requestAnimationFrame, caf = globalThis.cancelAnimationFrame, own = Object.getOwnPropertyDescriptor(performance, 'now')
  let t = 0, next = null, asks = 0
  globalThis.requestAnimationFrame = f => (next = f, ++asks)
  globalThis.cancelAnimationFrame = () => { next = null }
  performance.now = () => t
  return {
    at: ms => { t = ms },
    frame: ms => { t = ms; const f = next; next = null; f(ms) },
    get asked() { return next !== null },
    get asks() { return asks },
    done() {
      globalThis.requestAnimationFrame = raf, globalThis.cancelAnimationFrame = caf
      if (own) Object.defineProperty(performance, 'now', own); else delete performance.now
    }
  }
}

// an IntersectionObserver of the test's own: report(...states) tells the one built last what came into view or left, as
// one delivery
const observer = () => {
  const IO = globalThis.IntersectionObserver, io = { report() {}, disconnected: false }
  globalThis.IntersectionObserver = class {
    constructor(cb) { io.report = (...on) => cb(on.map(isIntersecting => ({ isIntersecting })), this) }
    observe() {}
    disconnect() { io.disconnected = true }
  }
  return Object.assign(io, { done() { globalThis.IntersectionObserver = IO } })
}

test('rise: every bar from the floor to where it stands, easing out, each from its own moment; all up on the last frame; a stop holds it', () => {
  const clk = frames()
  try {
    const seen = []
    rise([0, 50, 100], xs => seen.push(xs), 100)
    const frame = ms => (clk.frame(ms), seen.at(-1))
    // on the floor to begin; the bars set off in turn – the second at 50 ms, the third at 100 – each over 100 ms
    assert.deepEqual(frame(0), [0, 0, 0])
    assert.deepEqual(frame(25), [ease(0.25), 0, 0])
    assert.deepEqual(frame(75), [ease(0.75), ease(0.25), 0])
    assert.deepEqual(frame(150), [1, 1, ease(0.5)])
    // easing out, as CSS's ease-out and Penner's easeOutCubic: the way up is quickest at the start – further in a
    // quarter of the time than a quarter of the way – and each next step smaller
    const first = [0, 25, 50, 75, 100].map(ms => ease(ms / 100))
    assert.ok(first[1] > 0.25 && first.every((x, i) => !i || x > first[i - 1]))
    first.forEach((x, i) => assert.ok(i < 2 || x - first[i - 1] < first[i - 1] - first[i - 2], `step ${i}`))
    // all up on the last frame, and no frame asked for after it
    assert.deepEqual(frame(200), [1, 1, 1])
    assert.equal(clk.asked, false)
    // stopped, it draws no more
    const drawn = []
    rise([0], xs => drawn.push(xs), 100)()
    assert.equal(clk.asked, false), assert.equal(drawn.length, 0)
    // nothing to raise: a frame with nothing in it, and no more
    const none = []
    rise([], xs => none.push(xs))
    clk.frame(0)
    assert.deepEqual(none, [[]]), assert.equal(clk.asked, false)
  } finally { clk.done() }
})

test('rising: at the floor while out of view; up, once a visit, as it comes in; at the floor again once it has gone', () => {
  const clk = frames(), io = observer()
  try {
    const drawn = [], last = () => drawn.at(-1), enter = rising({}, [0, 50], xs => drawn.push(xs))
    // built at the floor, asking for no frame
    assert.deepEqual(drawn, [[0, 0]]), assert.equal(clk.asked, false)
    // reported out of view, it stays there
    io.report(false)
    assert.deepEqual(last(), [0, 0])
    // in: it rises, over rise's 250 ms, the second bar 50 ms after the first
    clk.at(1000), enter()
    clk.frame(1000), assert.deepEqual(last(), [0, 0])
    clk.frame(1100), assert.deepEqual(last(), [ease(100 / 250), ease(50 / 250)])
    // in again while it rises, as the way in is crossed back and forth: no second rise, no fall to the floor
    const n = drawn.length, asks = clk.asks
    enter(), enter()
    assert.equal(drawn.length, n), assert.equal(clk.asks, asks)
    clk.frame(1400), assert.deepEqual(last(), [1, 1]), assert.equal(clk.asked, false)
    // out of view, it's at the floor; in again, it rises again
    io.report(false), assert.deepEqual(last(), [0, 0])
    clk.at(2000), enter()
    clk.frame(2000), clk.frame(2125), assert.deepEqual(last(), [ease(125 / 250), ease(75 / 250)])
    // gone mid-rise: the rise is dropped, no frame left to draw, and it's at the floor – to rise whole on the next visit
    io.report(false)
    assert.deepEqual(last(), [0, 0]), assert.equal(clk.asked, false)
    clk.at(3000), enter(), clk.frame(3000), clk.frame(3050)
    assert.deepEqual(last(), [ease(50 / 250), 0])
    // still in view at the last of several reports, it stays up; out of view at the last, it falls
    io.report(false, true), assert.deepEqual(last(), [ease(50 / 250), 0])
    io.report(true, false), assert.deepEqual(last(), [0, 0])
  } finally { clk.done(), io.done() }
})

test('rising: where the page is to keep still, no floor and no rise – the bars as they were built', async () => {
  globalThis.matchMedia = () => ({ matches: true })
  try {
    const { rising: still } = await import('./dom.js?still'), drawn = []
    assert.equal(still({}, [0, 50], xs => drawn.push(xs)), undefined), assert.deepEqual(drawn, [])
  } finally { delete globalThis.matchMedia }
})

test('seen, soon: what a busy frame brings several reports of, as it stands at the last; soon runs once, if it was near at any', () => {
  const io = observer()
  try {
    const calls = []
    seen({}, on => calls.push(on))
    io.report(true), io.report(false), io.report(true, false), io.report(false, true), io.report(false, true, false)
    assert.deepEqual(calls, [true, false, false, true, false])
    let ran = 0
    soon({}, () => ran++)
    io.report(false), assert.equal(ran, 0), assert.equal(io.disconnected, false)
    io.report(false, true, false)
    assert.equal(ran, 1), assert.equal(io.disconnected, true)
  } finally { io.done() }
})

test('wander: a name at random, never one three times running, to another of its stops', () => {
  // the axes slide's stops; here it starts off them, at 120
  const STOPS = { wght: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950], rond: [0, 50, 100], yela: [-100, 0, 100] }
  const at = { wght: 120, rond: 0, yela: 0 }, next = wander(STOPS, n => at[n], noise(3)), names = [], hit = new Set()
  for (let i = 0; i < 3000; i++) {
    const [n, v] = next()
    assert.ok(STOPS[n].includes(v), `${i}: ${n} ${v} is a stop`), assert.notEqual(v, at[n], `${i}: ${n} moves`)
    at[n] = v, names.push(n), hit.add(`${n} ${v}`)
  }
  names.forEach((n, i) => assert.ok(i < 2 || !(n === names[i - 1] && n === names[i - 2]), `${i}: ${n} a third time running`))
  // twice running happens; every stop of every name is reached
  assert.ok(names.some((n, i) => n === names[i - 1]))
  assert.equal(hit.size, 11 + 3 + 3)
  // a hand leaves an axis off its stops: any stop is then a move
  const off = wander({ wght: [100, 900] }, () => 437, noise(5))
  assert.ok([100, 900].includes(off()[1]))
})

test('wave: two ribbons, a head rising to the top and a foot after it; the first thins, the second widens and rounds', () => {
  const N = 20, bars = [0, 1].map(w => Array.from({ length: N }, (_, i) => wave(w, i, N)))
  bars.forEach((row, w) => {
    const base = w ? 0 : 27
    row.forEach(([lo, hi, fill, rond], i) => {
      assert.ok(base <= lo && lo <= hi && hi <= base + 73 && Number.isInteger(lo) && Number.isInteger(hi), `${w} ${i}: ${lo}–${hi}`)
      assert.ok(fill > 0 && fill < 1 && rond >= 0 && rond <= 100)
      if (i) assert.ok(lo >= row[i - 1][0] && hi >= row[i - 1][1], `${w} ${i}: head and foot only rise`)
      if (i) assert.ok(w ? fill > row[i - 1][2] && rond >= row[i - 1][3] : fill < row[i - 1][2], `${w} ${i}: width and roundness`)
    })
    // a mark on the floor to begin, a mark at the top to end; full height between
    assert.deepEqual(row[0].slice(0, 2), [base, base]), assert.deepEqual(row[N - 1].slice(0, 2), [base + 73, base + 73])
    assert.ok(row.some(([lo, hi]) => hi - lo >= 70))
  })
  assert.equal(bars[1][0][3], 0), assert.equal(bars[1][N - 1][3], 100)
})

test('order: the two waves in one line, the second\'s j-th between the first\'s (j + 2)-th and the next', () => {
  const o = order(20), at = (w, i) => o.findIndex(([v, k]) => v === w && k === i)
  assert.equal(o.length, 40), assert.deepEqual(o.slice(0, 4), [[0, 0], [0, 1], [0, 2], [1, 0]]), assert.deepEqual(o.at(-1), [1, 19])
  for (let j = 0; j < 17; j++) assert.ok(at(0, j + 2) < at(1, j) && at(1, j) < at(0, j + 3), `${j}`)
})

const { round, step, pilot, fill, size, reach, course, layout, widths, grown, EVERY, WIN } = await import('./flappy.js')

test('flappy: each pipe heavier, the gap lower, till from the hundredth a cave – no room between the pipes, its gap shifting', () => {
  assert.ok(fill(0) < .05, 'a hairline first'), assert.equal(size(0), 40)
  for (let j = 1; j <= 100; j++) assert.ok(fill(j) > fill(j - 1) && size(j) < size(j - 1), `${j}`)
  for (const j of [100, 107]) assert.equal(fill(j), 1), assert.equal(size(j), 26)
  // a flap's rise is FLAP² / 2 FALL = 55² / 340 = 8.9 steps: the bird, 5, and a rise fit the narrowest gap, 26, with
  // room to shift
  assert.ok(5 + 55 ** 2 / 340 < size(100))
  const gap = course(noise(5))
  for (let j = 0; j < WIN; j++) {
    assert.ok(gap(j) >= size(j) / 2 + 4 && gap(j) <= 100 - size(j) / 2 - 4, `${j}: the gap within the field`)
    if (j) assert.ok(Math.abs(gap(j) - gap(j - 1)) <= reach(j - 1) + 1e-9, `${j}: a step within reach`)
  }
  assert.ok(reach(0) >= 20 && reach(100) === 7, 'wide steps to begin with, shifts of up to seven in the cave')
  assert.equal(course(noise(5))(77), gap(77), 'a course is its seed\'s')
})

test('flappy: the cave keeps climbing and diving to the end, not sitting where it began', () => {
  // over the last 28 pipes, 80 to 107: with no lean, the steps cancel out and the cave sits where it began; leaning
  // toward where the course heads, it crosses the field
  const spans = Array.from({ length: 20 }, (_, i) => {
    const gap = course(noise(i + 1)), g = Array.from({ length: 28 }, (_, k) => gap(80 + k))
    return Math.max(...g) - Math.min(...g)
  }).sort((a, b) => a - b)
  assert.ok(spans[0] >= 10, `every cave moves: the least ${spans[0].toFixed(1)}`)
  assert.ok(spans[10] >= 25, `most caves cross a quarter of the field: the median ${spans[10].toFixed(1)}`)
})

test('flappy: flown by itself, the bird wins – the 108th pipe behind it – on almost every course, at any frame rate', () => {
  // the autopilot flies as a steady hand would, not perfectly: of 20 courses at each rate, it may lose one
  for (const fps of [30, 60, 144]) {
    let won = 0
    for (let seed = 1; seed <= 20; seed++) {
      const s = round(noise(seed)), jit = noise(seed + 100)
      while (!s.over) { const dt = (1 + (jit() - .5) * .6) / fps; step(s, dt, pilot(s, dt)) }
      if (s.won) won++, assert.equal(s.pts, WIN), assert.ok(s.x > (WIN - 1) * EVERY)
    }
    assert.ok(won >= 19, `${fps} fps: won ${won} of 20`)
  }
})

test('flappy: won, the world goes on and the bird, free, rises out of the field', () => {
  const s = round(noise(3)), jit = noise(103)
  while (!s.over) { const dt = (1 + (jit() - .5) * .6) / 60; step(s, dt, pilot(s, dt)) }
  assert.ok(s.won, 'won')
  const x = s.x
  for (let t = 0; t < 2; t += 1 / 60) step(s, 1 / 60)
  assert.ok(s.x > x + 9, 'the world went on'), assert.ok(s.y > 105, `the bird is out of the top: ${s.y.toFixed(1)}`)
})

test('flappy prize: ॐ laid out past the last pipe – in the middle of the stripes, which run to the right edge, bars down it', () => {
  // a desktop's field and a phone's, at their pixel ratios, the last pipe five columns of forty
  for (const [w, h, px] of [[1440, 900, 1 / 2], [390, 844, 1 / 3], [820, 1180, 1 / 2]]) {
    const wall = w / 8, L = layout(w, h, px, wall), at = `${w}×${h}`
    assert.ok(L.gh <= .8 * h + 1e-9 && L.gw <= .84 * (w - wall) + 1e-9, `${at}: the glyph within four fifths of the field and the stripes`)
    assert.ok(Math.abs(L.gx + L.gw / 2 - (w - wall) / 2) < 1e-9 && Math.abs(L.gy + L.gh / 2 - h / 2) < 1e-9, `${at}: in their middle`)
    assert.ok(Math.abs(L.gw / L.p - 36) < 1, `${at}: 36 stripes across the glyph, ${L.gw / L.p}`)
    for (const v of [L.p, L.a]) assert.ok(Math.abs(v / px - Math.round(v / px)) < 1e-9, `${at}: ${v} on whole device pixels`)
    assert.ok(L.S * L.p >= w - wall && (L.S - 1) * L.p < w - wall, `${at}: stripes from the pipe to the right edge`)
    assert.ok(L.M * L.a >= h, `${at}: bars down its height`)
    assert.equal(L.F, 6 * L.p, `${at}: set at six pitches`)
    assert.ok(L.a + px <= L.F / 4 + 1e-9 && L.a > L.p, `${at}: a bar and a pixel over within the widest a bar comes, a quarter of the size – longer than a pitch`)
  }
})

test('flappy prize: a stripe thin clear of the glyph, thick within it, swelling between – a lens, never a step', () => {
  const S = 3, M = 40, p = 12, a = 3, cover = new Float32Array(S * M)
  // stripe 1 covered for rows 15 to 24 from the top; stripes 0 and 2 clear
  for (let r = 15; r < 25; r++) cover[r * S + 1] = 1
  const w = widths(cover, S, M, p, a), stripe = i => Array.from(w.subarray(i * M, i * M + M))
  for (const i of [0, 2]) assert.ok(stripe(i).every(v => Math.abs(v - 14) < 1e-6), `stripe ${i}: clear, a hairline all along`)
  // each stripe from its top, as the vertical line sets it: bar r is row r
  const s1 = stripe(1), mid = 20
  assert.ok(Math.abs(s1[mid] - 86) < 1e-6, 'deep in the glyph, as thick as a stripe comes, a gap to the next left')
  assert.ok(Math.abs(s1[0] - 14) < 1e-6 && Math.abs(s1[M - 1] - 14) < 1e-6, 'clear at both ends')
  // from the middle outward it only thins, and over more than one bar: a lens
  for (let m = mid; m < M - 1; m++) assert.ok(s1[m + 1] <= s1[m] + 1e-6, `thinning downward at ${m}`)
  for (let m = mid; m > 0; m--) assert.ok(s1[m - 1] <= s1[m] + 1e-6, `thinning upward at ${m}`)
  assert.ok(s1.filter(v => v > 14 + 1e-6 && v < 86 - 1e-6).length >= 4, 'swelling over several bars at each end, not in one')
  assert.ok(w.every(v => v >= 14 - 1e-6 && v <= 86 + 1e-6), 'never thinner than a hairline, never touching the next')
})

test('flappy prize: a bar is nothing till its turn, grows, then its ink glows for good – never so bold its stripe meets the next', () => {
  assert.equal(grown(86, 500, 0), 0, 'before its turn, nothing'), assert.equal(grown(86, 500, 500), 0, 'at its turn, still nothing')
  assert.ok(grown(86, 500, 700) > 0 && grown(86, 500, 700) < grown(86, 500, 1200), 'then growing')
  // grown, over a breath and long after: bolder and thinner by turns, as much either way
  const t = Array.from({ length: 280 }, (_, k) => 60000 + 10 * k), g = t.map(t => grown(86, 500, t))
  assert.ok(g.every(Number.isFinite), 'a width at every moment')
  assert.ok(Math.max(...g) > 86 * 1.1 && Math.min(...g) < 86 * .9, `still glowing a minute on: ${Math.min(...g).toFixed(1)} to ${Math.max(...g).toFixed(1)}`)
  // a hairline, clear of the glyph, stays one
  assert.ok(t.every(t => Math.abs(grown(14, 500, t) - 14) < 1e-9), 'the hairlines still')
  // the boldest a stripe comes, deep in the glyph and at the glow's height, leaves a gap to the next
  const full = widths(new Float32Array(1 * 9).fill(1), 1, 9, 12, 3)
  assert.ok(Math.max(...t.map(t => grown(Math.max(...full), 0, t))) < 100, 'the stripes never meet')
})


const { packet } = await import('./pad.js')
// lobes: runs of one sign among the bars a twentieth of the reach or more
const lobes = y => y.filter(v => Math.abs(v) >= 5).reduce((n, v, i, a) => n + (i && Math.sign(v) !== Math.sign(a[i - 1])), 1)

test('packet: at rest the logo – a lobe up, then its mirror down, the window\'s ends under half a step, dots', () => {
  const y = packet(0, 48)
  y.forEach((v, i) => assert.ok(Math.abs(v + y[47 - i]) < 1e-9, `bar ${i}: ${v}, its mirror ${y[47 - i]}`))
  assert.ok(y.slice(0, 24).every(v => v >= 0), 'the left lobe up')
  assert.ok(Math.max(...y) > 60, 'and tall')
  assert.ok(Math.abs(y[0]) < 0.5 && Math.abs(y[47]) < 0.5, 'the ends round to the line')
})

test('packet: within a bar\'s reach, ±100 – the pencil\'s and the marks\' – however long it runs', () => {
  let most = 0
  for (let t = 0; t < 600; t += 0.05) for (const v of packet(t, 48)) most = Math.max(most, Math.abs(v))
  assert.ok(most <= 100 && most > 95, `${most}`)
})

test('packet: its cycles breathe – two lobes at rest, three times as many half a breath in, two again a breath on', () => {
  assert.equal(lobes(packet(0, 48)), 2)
  assert.equal(lobes(packet(20, 48)), 6)
  assert.equal(lobes(packet(40, 48)), 2)
})

const { arrive } = await import('./shifts.js')

test('arrive: every bar where it set off before the way in, where it stands after, and not before; the last setting off a third in', () => {
  const n = 40
  for (let k = 0; k < n; k++) assert.equal(arrive(100, 20, 0, k, n), 100), assert.equal(arrive(-80, 20, 1, k, n), 20), assert.ok(arrive(100, 20, 0.8, k, n) > 20, `${k} in place early`)
  assert.equal(arrive(100, 20, 1 / 3, n - 1, n), 100), assert.ok(arrive(100, 20, 0.5, n - 1, n) < 100)
  // each bar goes one way, and one never passes the one before it
  for (let k = 0; k < n; k++) for (let i = 1; i <= 100; i++) {
    const w = i / 100
    assert.ok(arrive(100, 20, w, k, n) <= arrive(100, 20, w - 0.01, k, n), `${k} at ${w}`)
    if (k) assert.ok(arrive(100, 20, w, k, n) >= arrive(100, 20, w, k - 1, n), `${k} behind ${k - 1} at ${w}`)
  }
})

const { clock } = await import('./memo.js')

test('memo clock: nothing till audio comes; then the wall\'s speed, never past the audio, whether chunks come evenly or in bursts', () => {
  // 1024 samples a chunk at 48 kHz, heard 30 ms after they're spoken
  const C = 1024 / 48000, run = (arrive, ms) => {
    const c = clock(), out = []
    let got = 0, next = 0
    for (let now = 0; now < ms; now++) {
      while (next < arrive.length && arrive[next] <= now) got += C, c.hear(got, arrive[next++])
      out.push([now, c.at(now), got])
    }
    return out
  }
  const even = run(Array.from({ length: 90 }, (_, i) => 30 + (i + 1) * C * 1000), 1500)
  const burst = run(Array.from({ length: 90 }, (_, i) => 30 + Math.ceil((i + 1) / 4) * 4 * C * 1000), 1500)
  for (const out of [even, burst]) {
    assert.equal(out[0][1], -Infinity)
    for (const [now, t, got] of out) assert.ok(t <= got, `${now} ms: ${t} past ${got}`)
    // once going, a millisecond a millisecond, but where it waits for audio
    const going = out.filter(([, t, got]) => t > 0.1 && t < got)
    assert.ok(going.length > 900)
    for (let i = 1; i < going.length; i++) if (going[i][0] - going[i - 1][0] === 1) assert.ok(Math.abs(going[i][1] - going[i - 1][1] - 0.001) < 1e-9)
  }
  // bursts keep it a burst behind at most: four chunks
  for (const [, t, got] of burst.slice(300)) assert.ok(got - t < 4 * C + 1e-9)
})

test('memo clock: after a pause it waits for the audio to come again, then goes on from it, a chunk behind', () => {
  // chunks of 20 ms, each 30 ms after it's spoken
  const c = clock(), near = (a, b) => Math.abs(a - b) < 1e-9
  for (let i = 1; i <= 50; i++) c.hear(i * 0.02, 30 + i * 20)
  assert.ok(near(c.at(1030), 0.98), `${c.at(1030)}`)
  c.again()
  assert.equal(c.at(9000), -Infinity)
  for (let i = 1; i <= 50; i++) c.hear(1 + i * 0.02, 9000 + i * 20)
  assert.ok(near(c.at(10000), 1.98), `${c.at(10000)}`)
})

/**
 * An <audio> element as WebKit plays one (measured in Playwright's WebKit 26): 'playing' START ms after play(), its
 * clock still for LATE ms more, and 'ended' TAIL ms after its clock has run through. Its clock is the wall's; a sound
 * is the WAV behind its URL. It logs when a clock starts and when it ends, by URL; `deny` refuses a play(), `stuck`
 * sounds shorter than it never end. Timers run late under load: what's asserted is against the log, not the constants.
 */
const blobs = new Map()
URL.createObjectURL = b => { const u = `blob:${blobs.size}`; blobs.set(u, b); return u }
URL.revokeObjectURL = () => {}
globalThis.requestAnimationFrame ??= f => setTimeout(() => f(performance.now()), 16)
globalThis.cancelAnimationFrame ??= clearTimeout
class Fake extends EventTarget {
  static START = 10; static LATE = 60; static TAIL = 80; static log = []; static deny = false; static stuck = 0
  playbackRate = 1; loop = false; ended = false; duration = NaN; pos = 0; t0 = 0; go = 0; timers = []
  constructor() { super(), Fake.last = this }
  get currentTime() { return this.t0 ? Math.min(this.duration, this.pos + (performance.now() - this.t0) / 1000 * this.playbackRate) : this.pos }
  set currentTime(t) { this.pos = t }
  set src(u) { this.pause(), this.url = u, this.pos = 0, this.ended = false }
  get src() { return this.url }
  emit(type) { this.dispatchEvent(new Event(type)), this['on' + type]?.() }
  after(ms, f) { this.timers.push(setTimeout(f, ms)) }
  async play() {
    Fake.log.push(['play', this.url, performance.now()])
    const go = ++this.go, v = new DataView(await blobs.get(this.url).arrayBuffer())
    if (Fake.deny) throw new DOMException('refused', 'NotAllowedError')
    if (go !== this.go) throw new DOMException('paused', 'AbortError')
    this.duration = v.getUint32(40, true) / 2 / v.getUint32(24, true)
    return new Promise(ok => this.after(Fake.START, () => {
      this.emit('playing'), ok()
      this.after(Fake.LATE, () => {
        this.t0 = performance.now(), Fake.log.push(['clock', this.url, this.t0 - this.pos / this.playbackRate * 1000])
        if (this.duration >= Fake.stuck) this.after((this.duration - this.pos) / this.playbackRate * 1000 + Fake.TAIL, () => {
          this.pause(), this.pos = this.duration, this.ended = true, Fake.log.push(['ended', this.url, performance.now()]), this.emit('ended')
        })
      })
    }))
  }
  pause() { this.pos = this.currentTime, this.t0 = 0, this.go++, this.timers.forEach(clearTimeout), this.timers = [] }
}
globalThis.Audio = Fake
// a fresh sound.js: its delay not yet measured
let fresh = 0
const sound = () => import(`./sound.js?${fresh++}`)
const sleep = ms => new Promise(ok => setTimeout(ok, ms))
// the log's entries of a kind since an index, and for a URL: [url, ms]
const logged = (kind, from = 0) => Fake.log.slice(from).filter(e => e[0] === kind).map(e => e.slice(1))
// a sound played to its stop: what time() said and when, when it stopped, and what it said then
const follow = h => new Promise(ok => {
  const seen = [], look = () => { seen.push([performance.now(), h.time()]); if (!h.done) setTimeout(look, 4) }
  h.onend = () => { h.done = true, ok({ seen, stop: performance.now(), last: h.time() }) }
  look()
})
const S = s => new Float32Array(s * 48000)

test('play: nothing heard till its clock moves; then its clock, the delay a silence measured behind; done as it ends, at `to`', async () => {
  const { play, buffer } = await sound(), n = Fake.log.length, { seen, stop, last } = await follow(play(buffer(S(0.3), 48000)))
  const [[, silence], [url, clock]] = logged('clock', n), [[, quiet], [, end]] = logged('ended', n)
  // the silence: a tenth of a second, then what's still to be heard, TAIL and whatever the timers were late by
  const lag = (quiet - silence) / 1000 - 0.1
  assert.ok(lag >= Fake.TAIL / 1000 && lag < 0.2, `${lag}`)
  for (const [ms, x] of seen) if (ms < clock) assert.equal(x, 0)
  for (const [ms, x] of seen) if (x > 0 && x < 0.3) assert.ok(Math.abs(x - ((ms - clock) / 1000 - lag)) < 0.02, `${ms - clock} ms: ${x}`)
  assert.equal(last, 0.3)
  assert.ok(stop >= end && stop - end < 40, `stopped ${stop - end} ms after it ended`)
  assert.equal(logged('play', n).length, 2, 'the silence, then the sound')
})

test('play: the delay measured again at each end – a sound played through, then another, each done as it ends', async () => {
  const { play, buffer } = await sound(), a = buffer(S(0.2), 48000)
  await follow(play(a))
  const n = Fake.log.length, { seen, stop, last } = await follow(play(a))
  const [[, clock]] = logged('clock', n), [[, end]] = logged('ended', n)
  assert.equal(logged('play', n).length, 1, 'measured once, before the first sound')
  assert.equal(last, 0.2), assert.ok(stop >= end && stop - end < 40)
  // the first moment heard is as far after the clock started as the one before took to end
  const first = seen.find(([, x]) => x > 0)[0] - clock
  assert.ok(first > Fake.TAIL - 5 && first < Fake.TAIL + 60, `${first} ms`)
})

test('play: A while playing, then B – A stops where it was heard to, once; B plays to its end', async () => {
  const { play, buffer } = await sound(), a = buffer(S(0.4), 48000), b = buffer(S(0.25), 48000)
  await follow(play(a))
  const first = follow(play(a))
  await sleep(250)
  const [x, y] = await Promise.all([first, follow(play(b))])
  assert.ok(x.last > 0 && x.last < 0.4, `${x.last}`), assert.equal(y.last, 0.25)
})

test('play: part of a sound, from..to, heard to its end – the element runs the delay past it, then stops', async () => {
  const { play, buffer } = await sound(), buf = buffer(S(0.5), 48000)
  await follow(play(buf))
  const n = Fake.log.length, el = Fake.last, { seen, last } = await follow(play(buf, { from: 0.1, to: 0.3 }))
  assert.equal(last, 0.3), assert.ok(seen.every(([, x]) => x >= 0.1 && x <= 0.3))
  assert.equal(logged('ended', n).length, 0, 'stopped before its end')
  assert.ok(el.pos > 0.3 + Fake.TAIL / 1000 - 0.01 && el.pos < 0.3 + Fake.TAIL / 1000 + 0.08, `paused at ${el.pos}`)
})

test('play: stopped before it\'s heard, or refused – done at once, where it was to start, and the sound never plays', async () => {
  let { play, buffer } = await sound()
  const buf = buffer(S(0.2), 48000), n = Fake.log.length, h = play(buf, { from: 0.05 }), end = follow(h)
  h.stop()
  assert.equal((await end).last, 0.05)
  await sleep(400)
  assert.equal(logged('play', n).length, 1, 'the silence only')
  ;({ play } = await sound()), Fake.deny = true
  try { assert.equal((await follow(play(buf))).last, 0) } finally { Fake.deny = false }
})

test('play: a silence that never ends measures no delay – the sound plays after a second, heard as its clock goes', async () => {
  const { play, buffer } = await sound(), n = Fake.log.length
  Fake.stuck = 0.15
  try {
    const { seen, last } = await follow(play(buffer(S(0.2), 48000)))
    const [, [, clock]] = logged('clock', n), [[, played]] = logged('play', n)
    assert.equal(last, 0.2)
    assert.ok(clock - played > 1000, 'a second for the silence')
    const first = seen.find(([, x]) => x > 0)[0] - clock
    assert.ok(first < 25, `${first} ms`)
  } finally { Fake.stuck = 0 }
})
