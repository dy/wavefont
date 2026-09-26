/**
 * Sound for the wavefont site: loudness levels, microphone, playback, synthesis.
 * One sound at a time – like a messenger.
 */

let ctx, current, tapped

/** The page's AudioContext, resumed: call from a user gesture first (Safari). */
export const audio = () => {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Mono AudioBuffer of samples; needs no running context. */
export const buffer = (data, sampleRate) => {
  const b = new AudioBuffer({ length: Math.max(1, data.length), sampleRate })
  b.copyToChannel(data, 0)
  return b
}

/**
 * Loudness of n equal slices of data: RMS in dB, mapped to 0..1 over `range` dB below `ref`.
 * @param {Float32Array} data samples
 * @param {number} n slices
 * @param {number} [range] dB span shown, below ref
 * @param {number} [ref] dBFS drawn full height; the loudest slice when omitted, never below -60 dBFS so silence stays flat
 */
export function levels(data, n, range = 42, ref) {
  const out = new Float32Array(n), step = data.length / n
  let top = -Infinity
  for (let i = 0; i < n; i++) {
    const a = Math.floor(i * step), b = Math.max(a + 1, Math.floor((i + 1) * step))
    let s = 0
    for (let j = a; j < b; j++) s += data[j] * data[j]
    out[i] = 10 * Math.log10(s / (b - a) + 1e-12)
    if (out[i] > top) top = out[i]
  }
  ref ??= Math.max(top, -60)
  for (let i = 0; i < n; i++) out[i] = Math.min(1, Math.max(0, 1 + (out[i] - ref) / range))
  return out
}

/**
 * Levels as text where a pause of `gap` quiet slices or longer is one space: spoken words become words.
 * @param {ArrayLike<number>} lv levels 0..1
 * @param {number} dt seconds per level
 * @param {boolean} [live] keep trailing quiet (still recording)
 * @returns {{text: string, at: number[]}} at[k] is when char k starts, at[text.length] is the end
 */
export function speech(lv, dt, live = false, quiet = 0.14, gap = 6) {
  let a = 0, b = lv.length
  while (a < b && lv[a] < quiet) a++
  if (!live) while (b > a && lv[b - 1] < quiet) b--
  const codes = [], at = []
  for (let i = a; i < b;) {
    if (lv[i] < quiet) {
      let j = i
      while (j < b && lv[j] < quiet) j++
      if (j - i >= gap && j < b) { codes.push(32), at.push(i * dt), i = j; continue }
    }
    codes.push(0x100 + Math.round(lv[i] * 100)), at.push(i * dt), i++
  }
  at.push(b * dt)
  let text = ''
  for (let i = 0; i < codes.length; i += 8192) text += String.fromCharCode(...codes.slice(i, i + 8192))
  return { text, at }
}

const TAP = `registerProcessor('tap', class extends AudioWorkletProcessor {
  buf = new Float32Array(1024); n = 0
  process([input]) {
    const ch = input[0]
    if (ch) for (let i = 0; i < ch.length; i++) {
      this.buf[this.n++] = ch[i]
      if (this.n === this.buf.length) this.port.postMessage(this.buf.slice()), this.n = 0
    }
    return true
  }
})`

const join = chunks => {
  const data = new Float32Array(chunks.reduce((n, ch) => n + ch.length, 0))
  chunks.reduce((o, ch) => (data.set(ch, o), o + ch.length), 0)
  return data
}

/**
 * Record the microphone. Paused, it neither keeps nor reports what it hears.
 * @param {(chunk: Float32Array) => void} [onchunk] each 1024 samples as they arrive
 * @returns {Promise<{stop: () => AudioBuffer, snapshot: () => AudioBuffer, pause: () => void, resume: () => void}>}
 */
export async function record(onchunk) {
  const c = audio()
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
  })
  tapped ??= c.audioWorklet.addModule(URL.createObjectURL(new Blob([TAP], { type: 'text/javascript' })))
  await tapped
  const src = c.createMediaStreamSource(stream), tap = new AudioWorkletNode(c, 'tap'), mute = c.createGain()
  const chunks = []
  let paused = false
  mute.gain.value = 0 // pulls the tap without echoing the mic
  src.connect(tap).connect(mute).connect(c.destination)
  tap.port.onmessage = e => paused || (chunks.push(e.data), onchunk?.(e.data))
  return {
    pause() { paused = true },
    resume() { paused = false },
    /** What's recorded so far, recording on. */
    snapshot: () => buffer(join(chunks), c.sampleRate),
    stop() {
      stream.getTracks().forEach(t => t.stop())
      tap.port.onmessage = null
      src.disconnect(), tap.disconnect(), mute.disconnect()
      return buffer(join(chunks), c.sampleRate)
    }
  }
}

/** Decode an audio file (any format the browser plays) to mono. */
export async function decode(file) {
  const b = await audio().decodeAudioData(await file.arrayBuffer())
  if (b.numberOfChannels === 1) return b
  const mix = new Float32Array(b.length)
  for (let c = 0; c < b.numberOfChannels; c++) b.getChannelData(c).forEach((v, i) => mix[i] += v / b.numberOfChannels)
  return buffer(mix, b.sampleRate)
}

/** A mono buffer as a 16-bit PCM WAV file. */
export function wav(buf) {
  const d = buf.getChannelData(0), v = new DataView(new ArrayBuffer(44 + 2 * d.length))
  const ascii = (at, s) => [...s].forEach((c, i) => v.setUint8(at + i, c.charCodeAt(0)))
  ascii(0, 'RIFF'), v.setUint32(4, 36 + 2 * d.length, true), ascii(8, 'WAVEfmt ')
  v.setUint32(16, 16, true), v.setUint16(20, 1, true), v.setUint16(22, 1, true)
  v.setUint32(24, buf.sampleRate, true), v.setUint32(28, 2 * buf.sampleRate, true), v.setUint16(32, 2, true), v.setUint16(34, 16, true)
  ascii(36, 'data'), v.setUint32(40, 2 * d.length, true)
  for (let i = 0; i < d.length; i++) v.setInt16(44 + 2 * i, Math.max(-1, Math.min(1, d[i])) * 32767, true)
  return new Blob([v], { type: 'audio/wav' })
}

// each buffer plays from one object URL, let go with the buffer
const urls = new WeakMap(), gone = new FinalizationRegistry(url => URL.revokeObjectURL(url))
const url = buf => {
  let u = urls.get(buf)
  if (!u) urls.set(buf, u = URL.createObjectURL(wav(buf))), gone.register(buf, u)
  return u
}

/**
 * Play buf from..to seconds, or round and round with loop; stops whatever played before.
 * An <audio> element plays it, so a faster rate keeps the voice's pitch, as messengers do.
 * @returns {{time: () => number, rate: (r: number) => void, stop: () => void, onend?: () => void}}
 */
export function play(buf, { from = 0, to = buf.duration, rate = 1, loop = false } = {}) {
  current?.stop()
  const el = new Audio(url(buf))
  let done = false, timer = 0
  el.currentTime = from, el.playbackRate = rate, el.loop = loop
  // stop at `to`: a timer set for when the element gets there at its rate, set again on every change
  const due = () => {
    clearTimeout(timer)
    if (!loop && !done) timer = setTimeout(() => el.currentTime >= to - 0.01 ? h.stop() : due(), (to - el.currentTime) / el.playbackRate * 1000)
  }
  const h = {
    time: () => loop ? el.currentTime : Math.min(to, el.currentTime),
    rate(r) { el.playbackRate = r, due() },
    stop() {
      if (done) return
      done = true, clearTimeout(timer), el.pause()
      if (current === h) current = null
      h.onend?.()
    }
  }
  el.addEventListener('playing', due)
  el.addEventListener('ended', h.stop)
  el.addEventListener('error', h.stop)
  el.play().catch(h.stop)
  return current = h
}

/** The sound playing now, if any. */
export const playing = () => current

/** Deterministic noise, so every visit hears the same take. Mulberry32. */
const prng = seed => () => {
  seed = seed + 0x6D2B79F5 | 0
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
  return ((t ^ t >>> 14) >>> 0) / 4294967296
}

const normalize = (x, peak) => {
  let m = 0
  for (const v of x) m = Math.max(m, Math.abs(v))
  if (m) for (let i = 0; i < x.length; i++) x[i] *= peak / m
  return x
}

// Vowel formants F1–F3 in Hz, a e i o u: Peterson & Barney (1952), adult male averages
const VOWELS = [[730, 1090, 2440], [530, 1840, 2480], [270, 2290, 3010], [570, 840, 2410], [300, 870, 2240]]
const TABLE = 2048

/** One period of a sung vowel at pitch f0: harmonics weighted by formant resonances. */
const vowel = (formants, f0) => {
  const t = new Float32Array(TABLE), bw = [90, 110, 160], gain = [1, 0.55, 0.25]
  for (let k = 1; k * f0 < 4000; k++) {
    let a = 0.04
    formants.forEach((f, i) => a += gain[i] / (1 + ((k * f0 - f) / bw[i]) ** 2))
    a /= k ** 0.5
    for (let j = 0; j < TABLE; j++) t[j] += a * Math.sin(2 * Math.PI * k * j / TABLE)
  }
  return normalize(t, 1)
}

/**
 * Wordless speech: vowel syllables with phrase intonation, soft enough to loop.
 * @param {number} seed same seed, same take
 * @param {number} seconds length
 * @param {number} [f0] speaking pitch, Hz
 */
export function voice(seed, seconds, f0 = 140, sampleRate = 22050) {
  const rnd = prng(seed), sr = sampleRate, out = new Float32Array(Math.round(seconds * sr))
  const tables = VOWELS.map(v => vowel(v, f0))
  let t = 0.15, phase = 0
  while (t < seconds - 0.6) {
    // plan a phrase: words of 1–3 syllables, then speak it along a falling (or asking) contour
    const syl = [], ask = rnd() < 0.25
    for (let w = 2 + rnd() * 4 | 0, s = 0; w--; s = 0) {
      for (let n = 1 + rnd() * 3 | 0; n--; s++) syl.push({ d: 0.09 + rnd() * 0.11, amp: (s ? 0.62 : 1) * (0.65 + 0.35 * rnd()), gap: n ? 0.012 : 0.05 + rnd() * 0.09 })
    }
    const total = syl.reduce((a, s) => a + s.d + s.gap, 0)
    let u = 0
    for (const s of syl) {
      if (t + s.d > seconds - 0.3) break
      const va = tables[rnd() * 5 | 0], vb = tables[rnd() * 5 | 0], x0 = u / total, x1 = (u + s.d) / total
      const contour = x => 2 - 5 * x + (ask && x > 0.7 ? (x - 0.7) * 22 : 0)
      const p0 = contour(x0) + (rnd() - 0.5) * 1.6, p1 = contour(x1) + (rnd() - 0.5) * 0.8
      const i0 = Math.round(t * sr), n = Math.round(s.d * sr), rise = 0.025 * sr, fall = 0.06 * sr
      for (let i = 0; i < n; i++) {
        const x = i / n, env = Math.sin(Math.PI / 2 * Math.min(1, i / rise, (n - i) / fall)) ** 2
        const semis = p0 + (p1 - p0) * x + 0.18 * Math.sin(2 * Math.PI * 5.5 * (i0 + i) / sr)
        phase = (phase + f0 * 2 ** (semis / 12) / sr) % 1
        const p = phase * TABLE, j = p | 0, fr = p - j, k = (j + 1) % TABLE
        const a = va[j] + (va[k] - va[j]) * fr, b = vb[j] + (vb[k] - vb[j]) * fr
        out[i0 + i] += s.amp * env * (a + (b - a) * x)
      }
      t += s.d + s.gap, u += s.d + s.gap
    }
    t += 0.28 + rnd() * 0.4
  }
  // one-pole lowpass at ~3.2 kHz takes the edge off the harmonics
  for (let i = 1, k = Math.exp(-2 * Math.PI * 3200 / sr); i < out.length; i++) out[i] = out[i] * (1 - k) + out[i - 1] * k
  return buffer(normalize(out, 0.7), sr)
}

const hz = midi => 440 * 2 ** ((midi - 69) / 12)

/** Karplus–Strong string: a burst of soft noise circulating in a tuned delay line. */
function pluck(out, at, midi, amp, sr, rnd, seconds = 2.4) {
  const start = Math.round(at * sr), period = sr / hz(midi)
  const N = Math.floor(period - 0.5), frac = period - 0.5 - N, C = (1 - frac) / (1 + frac) // allpass tunes the fraction
  const line = new Float32Array(N)
  for (let i = 0, lp = 0; i < N; i++) line[i] = lp = 0.6 * lp + 0.4 * (rnd() * 2 - 1)
  const n = Math.min(out.length - start, Math.round(seconds * sr)), fade = Math.round(0.03 * sr)
  for (let i = 0, j = 0, last = 0, xin = 0, yout = 0; i < n; i++) {
    const x = line[j], avg = 0.4985 * (x + last)
    last = x
    yout = C * avg + xin - C * yout, xin = avg
    line[j] = yout
    j = j + 1 === N ? 0 : j + 1
    out[start + i] += amp * x * Math.min(1, (n - i) / fade)
  }
}

/** Freeverb-style room: 4 damped combs into 2 allpasses. */
function room(x, sr) {
  const s = sr / 44100, wet = new Float32Array(x.length)
  const combs = [1116, 1188, 1277, 1356].map(d => ({ b: new Float32Array(Math.round(d * s)), i: 0, f: 0 }))
  const passes = [556, 441].map(d => ({ b: new Float32Array(Math.round(d * s)), i: 0 }))
  for (let n = 0; n < x.length; n++) {
    let y = 0
    for (const c of combs) {
      const o = c.b[c.i]
      c.f = o * 0.75 + c.f * 0.25
      c.b[c.i] = x[n] + c.f * 0.84
      c.i = c.i + 1 === c.b.length ? 0 : c.i + 1
      y += o
    }
    for (const p of passes) {
      const o = p.b[p.i]
      p.b[p.i] = y + o * 0.5
      p.i = p.i + 1 === p.b.length ? 0 : p.i + 1
      y = o - y
    }
    wet[n] = y
  }
  return wet
}

/** Sections of the song, in bars: its chapters. */
export const CHAPTERS = [['intro', 0], ['arpeggio', 4], ['melody', 8], ['outro', 12]]
export const BPM = 92, BARS = 16

/**
 * A short song for plucked strings: Cmaj7 Am7 Fmaj7 G6, four times – strummed, arpeggiated, sung over, let go.
 * @param {number} [peak] loudest sample
 * @returns {AudioBuffer}
 */
export function song(sampleRate = 44100, peak = 0.89) {
  const rnd = prng(108), sr = sampleRate, beat = 60 / BPM, bar = 4 * beat
  const out = new Float32Array(Math.ceil((BARS * bar + 3) * sr))
  const chords = [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 52]]
  const arp = [0, 1, 2, 3, 2, 1, 2, 3]
  // melody over bars 8–11: [bar, beat, midi, gain]
  const tune = [[8, 0, 79], [8, 1.5, 76], [8, 2, 74], [8, 3, 72], [9, 0, 76], [9, 1, 81], [9, 2.5, 79], [9, 3, 76],
    [10, 0, 81], [10, 1.5, 79], [10, 2, 76], [10, 3, 72], [11, 0, 74], [11, 1, 76], [11, 2, 79]]
  for (let b = 0; b < BARS; b++) {
    const ch = chords[b % 4], t = b * bar
    const bassAt = b < 12 || b === 15 ? [0, 2] : [0]
    for (const k of bassAt) {
      const i0 = Math.round((t + k * beat) * sr), n = Math.round(bar * 0.9 * sr)
      for (let i = 0; i < n && i0 + i < out.length; i++) {
        const e = Math.min(1, i / (0.02 * sr)) * Math.exp(-i / (0.9 * sr)), w = 2 * Math.PI * hz(ch[0] - 12) * i / sr
        out[i0 + i] += 0.2 * e * (Math.sin(w) + 0.3 * Math.sin(2 * w))
      }
    }
    if (b < 4 || b === 15) ch.forEach((m, k) => pluck(out, t + k * 0.03, m + 12, 0.42, sr, rnd, b === 15 ? 4 : 2.6))
    else for (let e = 0; e < 8; e++) {
      if (b >= 12 && e % 2) continue // the outro thins out
      pluck(out, t + e * beat / 2, ch[arp[e]] + 12, e % 2 ? 0.26 : 0.34, sr, rnd)
    }
    if (b >= 8 && b < 12) for (const k of [0, 2]) {
      // a soft kick: a sine falling from 110 Hz
      const i0 = Math.round((t + k * beat) * sr), n = Math.round(0.3 * sr)
      for (let i = 0, ph = 0; i < n; i++) {
        ph += 2 * Math.PI * (45 + 65 * Math.exp(-i / (0.035 * sr))) / sr
        out[i0 + i] += 0.35 * Math.exp(-i / (0.09 * sr)) * Math.sin(ph)
      }
    }
  }
  for (const [b, k, m] of tune) pluck(out, b * bar + k * beat, m, 0.5, sr, rnd, 3)
  const wet = room(out, sr), dry = normalize(out, 1)
  normalize(wet, 0.35)
  for (let i = 0; i < out.length; i++) out[i] = dry[i] + wet[i]
  return buffer(normalize(out, peak), sr)
}
