/**
 * Renderings made for the site: data of other kinds drawn as bars. A scene is a frame of W × H and, made fresh for
 * each tile, a function of time t (s) giving its bars as [x, width, top, bottom] – every one a range bar of the font,
 * set as art.js sets traced pieces.
 */
import { laid } from './art.js'

export const W = 240, H = 150

const bell = (u, m, s) => Math.exp(-((u - m) ** 2) / (2 * s * s))

/**
 * Code 39, ISO/IEC 16388: a character's five bars and four spaces, bar first, w wide and n narrow; three are wide.
 * All 43 and the star read back through zxing-cpp, an independent decoder.
 */
export const CODE39 = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn',
  '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', A: 'wnnnnwnnw', B: 'nnwnnwnnw', C: 'wnwnnwnnn', D: 'nnnnwwnnw',
  E: 'wnnnwwnnn', F: 'nnwnwwnnn', G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn', K: 'wnnnnnnww',
  L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww', O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn',
  S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw', W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn',
  Z: 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', $: 'nwnwnwnnn', '/': 'nwnwnnnwn', '+': 'nwnnnwnwn',
  '%': 'nnnwnwnwn', '*': 'nwnnwnwnn'
}

/** Text as Code 39 bars, [start, width] in modules: between the start and stop stars, a narrow space between characters. */
export const code39 = (text, wide = 3) => {
  const bars = []
  let x = 0
  for (const [i, c] of [...`*${text}*`].entries()) {
    if (i) x += 1
    for (const [j, e] of [...CODE39[c]].entries()) {
      const w = e === 'w' ? wide : 1
      if (j % 2 === 0) bars.push([x, w])
      x += w
    }
  }
  return { bars, width: x }
}

export const scenes = {
  // a heart monitor: 72 beats a minute swept across in 4 s, the pen leaving a gap ahead of it. Each column is the
  // lowest to the highest the trace passes through there: min–max bars drawing a line
  ecg: () => {
    const n = 120, p = W / n, T = 4, mid = H * 0.62, A = H * 0.5
    // a beat as lead II draws it: P wave, Q, R, S, T wave
    const beat = u => 0.12 * bell(u, 0.2, 0.035) - 0.1 * bell(u, 0.37, 0.01) + bell(u, 0.4, 0.012) - 0.22 * bell(u, 0.43, 0.012) + 0.25 * bell(u, 0.68, 0.055)
    const at = time => beat(((time * 1.2) % 1 + 1) % 1)
    return t => {
      const sweep = Math.floor(t / T), head = (t % T) / T * n, bars = []
      for (let i = 0; i < n; i++) {
        if (i > head && i < head + 6) continue
        const t0 = ((i <= head ? sweep : sweep - 1) + i / n) * T
        let lo = Infinity, hi = -Infinity
        for (let k = 0; k <= 4; k++) { const v = at(t0 + k / 4 * T / n); lo = Math.min(lo, v), hi = Math.max(hi, v) }
        // at least a line's thickness where the trace runs flat
        const c = mid - (lo + hi) / 2 * A, half = Math.max((hi - lo) / 2 * A, 0.9)
        bars.push([i * p, p * 0.9, c - half, c + half])
      }
      return bars
    }
  },

  // a Lissajous figure, x = sin 3a, y = sin (2a + φ), turning slowly as φ moves: each column holds a bar for every
  // stretch of the curve in it – min–max bars drawing a closed curve
  lissajous: () => {
    const n = 60, p = W / n, R = H * 0.44, Rx = W / 2 - p, M = 1200
    return t => {
      const cols = Array.from({ length: n }, () => [])
      for (let k = 0; k < M; k++) {
        const a = k / M * 2 * Math.PI
        cols[Math.min(n - 1, Math.floor((W / 2 + Rx * Math.sin(3 * a)) / p))].push(H / 2 + R * Math.sin(2 * a + 0.15 * t))
      }
      const bars = []
      cols.forEach((ys, i) => {
        ys.sort((a, b) => a - b)
        for (let j = 1, a = ys[0]; j <= ys.length; j++) if (j === ys.length || ys[j] - ys[j - 1] > 3) bars.push([i * p + p * 0.15, p * 0.7, a - 1.2, ys[j - 1] + 1.2]), a = ys[j]
      })
      return bars
    }
  },

  // Code 39: WAVEFONT, a module narrow and three wide, ten modules of quiet either side – a camera reads it. It
  // prints, bar after bar, as text is typed; holds; and prints again
  barcode: () => {
    const { bars, width } = code39('WAVEFONT'), s = W / (width + 20), T = 9
    return t => bars.slice(0, Math.ceil(Math.min(1, (t % T) / 2.5) * bars.length)).map(([m, w]) => [(m + 10) * s, w * s, 4, H - 4])
  },
}

/** A scene as a traced piece at time t, fresh for each tile. */
export const scene = name => {
  const at = scenes[name](), frame = { w: W, h: H, slices: [{ y: 0, h: H }] }
  return t => laid(frame, at(t))
}
