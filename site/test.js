import test from 'node:test'
import assert from 'node:assert/strict'

// AudioBuffer is a browser API; synthesis only constructs one and reads its channel back
globalThis.AudioBuffer ??= class {
  constructor({ length, sampleRate }) { this.length = length, this.sampleRate = sampleRate, this.duration = length / sampleRate, this.data = new Float32Array(length) }
  copyToChannel(d) { this.data.set(d) }
  getChannelData() { return this.data }
}
const { levels, speech, voice, song, wav, BPM, BARS } = await import('./sound.js')
test('levels: dB below the loudest slice over the range', () => {
  const n = 4000, data = new Float32Array(2 * n)
  for (let i = 0; i < n; i++) data[i] = Math.sin(i / 3), data[n + i] = 0.5 * Math.sin(i / 3)
  const [loud, half] = levels(data, 2, 42)
  assert.equal(loud, 1)
  // half amplitude is 20·log10(0.5) = −6.02 dB
  assert.ok(Math.abs(half - (1 - 6.0206 / 42)) < 1e-3, `${half}`)
  assert.deepEqual([...levels(new Float32Array(100), 4)], [0, 0, 0, 0])
})

test('speech: a pause of 6 quiet slices is one space, edges trimmed', () => {
  const lv = [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0], dt = 0.05
  const { text, at } = speech(lv, dt)
  assert.equal(text.length, 5)
  assert.equal(text[2], ' ')
  assert.deepEqual(at.map(t => Math.round(t / dt)), [1, 2, 3, 9, 10, 11])
  // shorter pauses stay as bars, so a phrase is one word
  assert.equal(speech([1, 0, 0, 1], dt).text.includes(' '), false)
})

test('voice: same seed, same take; normalized to 0.7', () => {
  const a = voice(1, 2).getChannelData(0), b = voice(1, 2).getChannelData(0)
  assert.deepEqual(a, b)
  assert.ok(Math.abs(Math.max(...a.map(Math.abs)) - 0.7) < 1e-6)
  assert.ok(a.every(Number.isFinite))
})

test('song: 16 bars at 92 BPM plus a 3 s tail, normalized to its peak', () => {
  const b = song(), d = b.getChannelData(0)
  assert.equal(b.length, Math.ceil((BARS * 4 * 60 / BPM + 3) * 44100))
  const peak = x => x.reduce((m, v) => Math.max(m, Math.abs(v)), 0)
  assert.ok(Math.abs(peak(d) - 0.89) < 1e-6)
  assert.ok(d.every(Number.isFinite))
  // the site's player plays it softly
  assert.ok(Math.abs(peak(song(22050, 0.25).getChannelData(0)) - 0.25) < 1e-6)
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

const { commits } = await import('./data.js')

test('commits: one count per month, August 2016 to September 2026', () => {
  assert.deepEqual(commits.from, [2016, 8])
  assert.equal(commits.months.length, (2026 - 2016) * 12 + 9 - 8 + 1)
  assert.ok(commits.months.every(n => Number.isInteger(n) && n >= 0))
  assert.ok(commits.months[0] > 0 && commits.months.at(-1) > 0, 'first and last month have commits')
})

const { art } = await import('./art-data.js')
const { bar, motion, reach, crop } = await import('./art.js')
const { char, shift } = await import('../index.js')

test('traced pieces: bars inside their slice, each line sorted and not overlapping', () => {
  const pieces = Object.values(art)
  assert.equal(pieces.length, 6)
  for (const p of pieces) for (const s of p.slices) {
    assert.ok(s.y >= 0 && s.y + s.h <= p.h + 1)
    for (const line of s.lines) {
      assert.equal(line.length % 4, 0)
      for (let i = 0; i < line.length; i += 4) {
        const [x, w, top, bot] = line.slice(i, i + 4)
        assert.ok(x >= 0 && w > 0 && x + w <= p.w, `x ${x} w ${w} of ${p.w}`)
        assert.ok(top >= 0 && bot > top && bot <= s.h + 1, `top ${top} bottom ${bot} of ${s.h}`)
        if (i) assert.ok(x >= line[i - 4] + line[i - 3], 'a line is one run of text: no bar starts inside the one before')
      }
    }
  }
})

test('bar: a value, centred, and the marks shifting it from level 64 to span lo to hi', () => {
  // readme: a value is its height in levels; at YELA 0 it's centred on the line's middle, level 64; each 1-step mark
  // moves it a level, U+0301 up and U+0300 down, each 10-step mark ten, U+0302 up and U+030C down
  const steps = { '\u0302': 10, '\u0301': 1, '\u030C': -10, '\u0300': -1 }
  const span = str => {
    const v = str.charCodeAt(0) - 0x100, s = [...str.slice(1)].reduce((n, m) => n + steps[m], 0)
    return [64 + s - v / 2, 64 + s + v / 2]
  }
  assert.equal(bar(10, 20), char(10) + shift(-49), 'centred at 15: 49 levels below the middle')
  assert.equal(bar(54, 74), char(20), 'centred at 64: no marks')
  // every span a slice's levels can ask for, 0 to 126: exact, or a level more at the top where lo + hi is odd
  for (let lo = 0; lo <= 126; lo++) for (let hi = lo; hi <= 126; hi++) {
    const [a, b] = span(bar(lo, hi))
    assert.ok(a === lo && b === hi + ((lo + hi) & 1), `${lo}..${hi}: ${a}..${b}`)
  }
})

test('motion: every piece, at any time, anywhere the pointer is, stays bars inside its slices', () => {
  for (const [name, make] of Object.entries(motion)) {
    const at = make(art[name])
    for (const t of [0, 2.5, 13.1]) for (const x of [0, 0.3, 0.5, 1]) for (const y of [0, 0.5, 1]) {
      const p = at(t, { x, y })
      assert.ok(p.w > 0 && p.h > 0 && p.slices.length)
      for (const s of p.slices) for (const line of s.lines) {
        assert.equal(line.length % 4, 0)
        for (let i = 0; i < line.length; i += 4) {
          const [bx, w, top, bot] = line.slice(i, i + 4)
          assert.ok(Number.isFinite(bx) && w > 0 && top >= 0 && bot > top && bot <= s.h + 1, `${name} at ${t}, ${x},${y}: ${line.slice(i, i + 4)}`)
          if (i) assert.ok(bx >= line[i - 4] + line[i - 3] - 1e-9, `${name}: bars of a line don't start inside each other`)
        }
      }
    }
  }
})

test('motion: slide and stairs, the pointer in the middle, are the traced pieces', () => {
  const bars = p => p.slices.flatMap(s => s.lines.flatMap(l => Array.from({ length: l.length / 4 }, (_, i) => l.slice(4 * i, 4 * i + 4)).filter(b => b[1] > 1).map(b => [s.y, ...b].join()))).sort()
  for (const name of ['slide', 'stairs']) assert.deepEqual(bars(motion[name](art[name])(0, { x: 0.5, y: 0.5 })), bars(art[name]), name)
})

test('pieces cut to where they move: at any time, bars inside the cut', () => {
  for (const [name, make] of Object.entries(motion)) {
    const raw = art[name]
    if (raw.slices.length > 1) continue
    const cut = crop(raw, reach(raw, make(raw))), at = make(cut)
    assert.ok(cut.w <= raw.w && cut.h <= raw.h, name)
    for (const t of [0, 0.4, 2.7, 13.1, 61.3]) for (const line of at(t, { x: 0.5, y: 0.5 }).slices[0].lines) for (let k = 0; k < line.length; k += 4) {
      const [x, w, top, bot] = line.slice(k, k + 4)
      assert.ok(x >= -1 && x + w <= cut.w + 1 && top >= -1 && bot <= cut.h + 1, `${name} at ${t}: ${line.slice(k, k + 4)} of ${cut.w} × ${cut.h}`)
    }
  }
})

const { weight } = await import('./wave.js')

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
