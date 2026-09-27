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

const { tiles, art, ring: RING } = await import('./art-data.js')
const { ring } = await import('./art.js')

test('traced pieces: bars inside their slice, each line sorted and not overlapping', () => {
  const pieces = [...tiles.filter(Boolean), ...Object.values(art)]
  assert.equal(pieces.length, 8 + 1)
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

test('ring: one bar per spoke, weights within the axis', () => {
  const svg = ring(RING), weights = [...svg.matchAll(/--wght:([\d.]+)/g)].map(m => +m[1])
  assert.equal(weights.length, RING.spokes.length)
  assert.ok(weights.every(w => w >= 4 && w <= 1000))
  assert.ok(weights[0] > weights.at(-1), 'thick at the top, thinning clockwise')
})

const { bench, weather, commits } = await import('./data.js')

test('weather: Montreal 2025, a low and a high every day, inside the chart', () => {
  // data: Open-Meteo archive, URL in data.js; the chart spans −30 to 40 °C
  assert.equal(weather.lo.length, 365), assert.equal(weather.hi.length, 365)
  weather.lo.forEach((l, i) => {
    const u = weather.hi[i]
    assert.ok(Number.isFinite(l) && Number.isFinite(u) && l <= u, `day ${i}: ${l} to ${u}`)
    assert.ok(l >= -30 && u <= 40, `day ${i} outside −30..40 °C`)
  })
})

test('bench: every stack and op, and wavefont within a 60 Hz frame on every browser', () => {
  // wavearea bench/render, wavefont 3.8.1: results/<browser>.json, window view medians
  const { ops, stacks, text, browsers } = bench
  assert.deepEqual(stacks, ['wavefont', 'svg', 'html', 'canvas'])
  assert.equal(text.length, stacks.length)
  for (const [name, rows] of Object.entries(browsers)) {
    assert.equal(rows.length, stacks.length, name)
    rows.forEach(r => assert.ok(r.length === ops.length && r.every(ms => ms > 0), name))
    assert.ok(rows[0].every(ms => ms <= 1000 / 60), `${name}: wavefont ${rows[0]}`)
  }
})

test('commits: one count per month, August 2016 to September 2026', () => {
  assert.deepEqual(commits.from, [2016, 8])
  assert.equal(commits.months.length, (2026 - 2016) * 12 + 9 - 8 + 1)
  assert.ok(commits.months.every(n => Number.isInteger(n) && n >= 0))
  assert.ok(commits.months[0] > 0 && commits.months.at(-1) > 0, 'first and last month have commits')
})

const { motion, tileMotion } = await import('./art.js')

test('motion: every piece, anywhere the pointer is, stays a set of bars inside its slices', () => {
  for (const [name, make] of Object.entries(motion)) {
    const at = make(art[name])
    for (const x of [0, 0.3, 0.5, 1]) for (const y of [0, 0.5, 1]) {
      const p = at(2.5, { x, y })
      assert.ok(p.w > 0 && p.h > 0 && p.slices.length)
      for (const s of p.slices) for (const line of s.lines) {
        assert.equal(line.length % 4, 0)
        for (let i = 0; i < line.length; i += 4) {
          const [bx, w, top, bot] = line.slice(i, i + 4)
          assert.ok(Number.isFinite(bx) && w > 0 && top >= 0 && bot > top && bot <= s.h + 1, `${name} ${x},${y}: ${line.slice(i, i + 4)}`)
          // the figure's lens lets a widened bar run into its neighbours: text draws them over each other
          if (i && name !== 'figure') assert.ok(bx >= line[i - 4] + line[i - 3] - 1e-9, `${name}: bars of a line don't start inside each other`)
        }
      }
    }
  }
})

test('tiles in motion: at any time, bars inside their tile', () => {
  tileMotion.forEach((make, i) => {
    const at = make(tiles[i])
    for (const t of [0, 0.4, 2.7, 13.1]) {
      const p = at(t)
      for (const s of p.slices) for (const line of s.lines) for (let k = 0; k < line.length; k += 4) {
        const [x, w, top, bot] = line.slice(k, k + 4)
        assert.ok(Number.isFinite(x) && w > 0 && x >= -1 && x + w <= p.w + 1, `tile ${i} at ${t}: x ${x} w ${w}`)
        assert.ok(top >= 0 && bot > top && bot <= s.h + 1, `tile ${i} at ${t}: ${top}..${bot}`)
        if (k) assert.ok(x >= line[k - 4] + line[k - 3] - 1e-9, `tile ${i}: bars of a line don't start inside each other`)
      }
    }
  })
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
