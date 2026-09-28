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

const { weight, valueOf } = await import('./wave.js')

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

const { wander, noise } = await import('./dom.js')

test('wander: a name at random, never one three times running, to another of its stops', () => {
  // the axes slide's stops; it starts off them, at the slider's 120
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

