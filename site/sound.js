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
  let done = false, timer = 0, anchor = from, since = 0, running = false, shown = from
  el.currentTime = from, el.playbackRate = rate, el.loop = loop
  // the element's clock ticks coarsely in some browsers: between ticks, time runs on at the rate, leaning a little
  // toward the element's time at every look, so it follows without a jump; a real jump (a loop's turn) it takes at once.
  // Time runs one way: a small step back, the element catching up, is held
  const now = () => {
    let v = el.currentTime
    if (running) {
      const guess = anchor + (performance.now() - since) / 1000 * el.playbackRate
      if (Math.abs(v - guess) > 0.25) anchor = v, since = performance.now()
      else anchor += (v - guess) * 0.05, v = guess + (v - guess) * 0.05
    }
    return shown = v < shown && shown - v < 0.5 ? shown : v
  }
  // stop at `to`: a timer set for when the element gets there at its rate, set again on every change
  const due = () => {
    clearTimeout(timer)
    if (!loop && !done) timer = setTimeout(() => el.currentTime >= to - 0.01 ? h.stop() : due(), (to - el.currentTime) / el.playbackRate * 1000)
  }
  const h = {
    time: () => loop ? now() % buf.duration : Math.min(to, now()),
    rate(r) { anchor = now(), since = performance.now(), el.playbackRate = r, due() },
    stop() {
      if (done) return
      done = true, running = false, clearTimeout(timer), el.pause()
      if (current === h) current = null
      h.onend?.()
    }
  }
  el.addEventListener('playing', () => { anchor = el.currentTime, since = performance.now(), running = true, due() })
  el.addEventListener('waiting', () => running = false)
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

// Vowel formants F1–F3, Hz: Peterson & Barney (1952), "Control methods used in a study of the vowels",
// adult male averages for heed hid head had hod hawed hood who'd hud heard
const VOWELS = [[270, 2290, 3010], [390, 1990, 2550], [530, 1840, 2480], [660, 1720, 2410], [730, 1090, 2440],
  [570, 840, 2410], [440, 1020, 2240], [300, 870, 2240], [640, 1190, 2390], [490, 1350, 1690]]
// Consonants, roughly: [kind, F1–F3 or the formant loci a stop pulls toward, noise centre Hz, voiced]
const CONSONANTS = {
  m: ['nasal', [480, 1270, 2130]], n: ['nasal', [480, 1340, 2470]],
  l: ['glide', [360, 1300, 2700]], r: ['glide', [310, 1060, 1380]], w: ['glide', [290, 610, 2150]], j: ['glide', [260, 2070, 3020]],
  s: ['fric', [320, 1400, 2700], 5500], sh: ['fric', [300, 1840, 2750], 2800], f: ['fric', [340, 1100, 2080], 6500], h: ['fric', null, 1500],
  z: ['fric', [320, 1400, 2700], 5500, true], v: ['fric', [340, 1100, 2080], 6500, true],
  p: ['stop', [400, 800, 2200], 1000], t: ['stop', [400, 1800, 2600], 4000], k: ['stop', [400, 2300, 2600], 2200],
  b: ['stop', [400, 800, 2200], 1000, true], d: ['stop', [400, 1800, 2600], 4000, true], g: ['stop', [400, 2300, 2600], 2200, true]
}
const ONSETS = 'ttddkkssnnmmllrrwwjhhbbppggfvz sh'.split(' ').join('').match(/sh|./g), CODAS = 'nnnmsstkld'.split('')

/**
 * Wordless speech as heard through a wall: a glottal pulse through moving vocal-tract resonances,
 * syllables with their consonants, the pitch of a phrase falling (or asking), breath, then muffled.
 * @param {number} seed same seed, same take
 * @param {number} seconds length
 * @param {number} [f0] speaking pitch, Hz; formants scale with it, as voices do
 */
export function voice(seed, seconds, f0 = 140, sampleRate = 22050) {
  const rnd = prng(seed), sr = sampleRate, n = Math.round(seconds * sr), out = new Float32Array(n)
  const size = (f0 / 120) ** 0.33, pick = a => a[rnd() * a.length | 0]

  // plan: phrases of syllables, each a list of segments with the vocal tract's targets, and the pitch's knots
  const segs = [], knots = []
  const seg = (dur, p) => { const t0 = segs.length ? segs.at(-1).t1 : 0.12; segs.push({ t0, t1: t0 + dur, ...p }) }
  const quiet = (dur, F) => seg(dur, { F, B: [200, 250, 300], AV: 0, AH: 0, AF: 0 })
  while ((segs.at(-1)?.t1 ?? 0) < seconds - 0.9) {
    const count = 3 + rnd() * 7 | 0, ask = rnd() < 0.2, first = rnd() < 0.5 ? 0 : 1
    for (let i = 0; i < count; i++) {
      const stress = i % 2 === first, last = i === count - 1, V = pick(VOWELS)
      const onset = rnd() < 0.75 && CONSONANTS[pick(ONSETS)]
      if (onset) {
        const [kind, F = V, freq, voiced] = onset
        if (kind === 'stop') {
          quiet(0.035 + rnd() * 0.025, F), segs.at(-1).AV = voiced ? 0.12 : 0
          seg(0.012, { F, B: [300, 300, 400], AV: 0, AH: 0, AF: 0.9, FF: freq, FB: 2000 })
          if (!voiced) seg(0.03, { F: V, B: [150, 200, 250], AV: 0, AH: 0.45, AF: 0 })
        } else if (kind === 'fric') seg(0.06 + rnd() * 0.03, { F: F ?? V, B: [200, 250, 300], AV: voiced ? 0.35 : 0, AH: F ? 0 : 0.5, AF: F ? 0.7 : 0, FF: freq, FB: 1500 })
        else seg(0.04 + rnd() * 0.03, { F, B: kind === 'nasal' ? [150, 300, 400] : [80, 110, 160], AV: kind === 'nasal' ? 0.45 : 0.8, AH: 0, AF: 0 })
      }
      const dur = (stress ? 0.11 + rnd() * 0.06 : 0.065 + rnd() * 0.05) * (last ? 1.4 : 1)
      seg(dur, { F: V, B: [70, 100, 150], AV: stress ? 1 : 0.72, AH: 0.02, AF: 0 })
      // pitch at the vowel's middle: a falling line, stressed syllables lifted, the end falling or rising
      const x = i / Math.max(1, count - 1), mid = segs.at(-1).t0 + dur / 2
      knots.push([mid, 2.5 - 4.5 * x + (stress ? 2 + rnd() * 1.5 : rnd() * 0.6) + (last ? (ask ? 5 : -2.5) : 0)])
      const coda = rnd() < 0.3 && CONSONANTS[pick(CODAS)]
      if (coda) {
        const [kind, F = V, freq] = coda
        if (kind === 'stop') quiet(0.04, F), seg(0.01, { F, B: [300, 300, 400], AV: 0, AH: 0, AF: 0.6, FF: freq, FB: 2000 })
        else seg(0.05, { F, B: kind === 'fric' ? [200, 250, 300] : [150, 300, 400], AV: kind === 'fric' ? 0 : 0.45, AH: 0, AF: kind === 'fric' ? 0.55 : 0, FF: freq, FB: 1500 })
      }
    }
    quiet(0.2 + rnd() * 0.3, segs.at(-1).F)
  }

  // render: parameters glide toward each segment's targets – the glides are coarticulation
  const glide = (tau) => 1 - Math.exp(-1 / (tau * sr))
  const kF = glide(0.02), kA = glide(0.006)
  const F = [500, 1500, 2500], B = [80, 100, 150], R = [[0, 0], [0, 0], [0, 0]], C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  const fric = [0, 0], fc = [0, 0, 0]
  let AV = 0, AH = 0, AF = 0, FF = 3000, FB = 1500, phase = 0, flow = 0, jit = 0, shim = 1, si = 0, ki = 0
  const coef = (c, f, bw) => {
    c[2] = -Math.exp(-2 * Math.PI * bw / sr), c[1] = 2 * Math.exp(-Math.PI * bw / sr) * Math.cos(2 * Math.PI * Math.min(f, sr * 0.45) / sr), c[0] = 1 - c[1] - c[2]
  }
  const res = (st, c, x) => { const y = c[0] * x + c[1] * st[0] + c[2] * st[1]; st[1] = st[0], st[0] = y; return y }
  for (let i = 0; i < n; i++) {
    const t = i / sr
    while (si < segs.length - 1 && t >= segs[si].t1) si++
    const s = segs[si] && t >= segs[si].t0 && t < segs[si].t1 ? segs[si] : null
    const tF = s ? s.F : F, tB = s ? s.B : B
    for (let k = 0; k < 3; k++) F[k] += (tF[k] * size - F[k]) * kF, B[k] += (tB[k] - B[k]) * kF
    AV += ((s?.AV ?? 0) - AV) * kA, AH += ((s?.AH ?? 0) - AH) * kA, AF += ((s?.AF ?? 0) - AF) * kA
    if (s?.FF) FF = s.FF, FB = s.FB
    if (i % 16 === 0) { for (let k = 0; k < 3; k++) coef(C[k], F[k], B[k]); coef(fc, FF, FB) }
    // pitch: between the knots, in semitones, with a little wandering
    while (ki < knots.length - 1 && t >= knots[ki + 1][0]) ki++
    const [ta, sa] = knots[ki] ?? [0, 0], [tb, sb] = knots[ki + 1] ?? [ta + 1, sa]
    const semis = sa + (sb - sa) * Math.min(1, Math.max(0, (t - ta) / (tb - ta)))
    phase += f0 * 2 ** ((semis + jit) / 12) / sr
    if (phase >= 1) phase -= 1, jit = jit * 0.7 + (rnd() - 0.5) * 0.25, shim = 0.94 + rnd() * 0.12
    // glottal flow opens for 60% of a period (KLGLOTT88 shape); its slope is what the lips radiate
    const x = phase / 0.6, u = x < 1 ? 6.75 * x * x * (1 - x) : 0, g = u - flow
    flow = u
    const noise = rnd() * 2 - 1
    const src = AV * shim * g * 40 + noise * (AH + AV * 0.04 * u)
    let y = res(R[0], C[0], src)
    y = res(R[1], C[1], y), y = res(R[2], C[2], y)
    out[i] = y + res(fric, fc, noise * AF * 0.3)
  }
  // through a wall: a two-pole lowpass at 1.4 kHz, then a little room
  const lp = [0, 0], lc = [0, 0, 0]
  coef(lc, 0, 1.4e3 * Math.SQRT2)
  let prev = 0
  for (let i = 0; i < n; i++) { const y = res(lp, lc, out[i]); out[i] = 0.5 * (y + prev), prev = y }
  const wet = room(out, sr)
  normalize(wet, 0.12), normalize(out, 1)
  for (let i = 0; i < n; i++) out[i] += wet[i]
  return buffer(normalize(out, 0.7), sr)
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
