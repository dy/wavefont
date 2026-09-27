/**
 * Renderings made for the site: data of other kinds drawn as bars. A scene is a frame of W × H and, made fresh for
 * each tile, a function of time t (s) giving its bars as [x, width, top, bottom] – every one a range bar of the font,
 * set as art.js sets traced pieces.
 */
import { laid } from './art.js'

export const W = 240, H = 150

/** A number in [0, 1) for every integer, always the same one: lowbias32 (Wellons, hash-prospector). */
const rand = k => {
  let x = k | 0
  x ^= x >>> 16, x = Math.imul(x, 0x7feb352d), x ^= x >>> 15, x = Math.imul(x, 0x846ca68b), x ^= x >>> 16
  return (x >>> 0) / 4294967296
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
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
  // an analyser: 24 bands, a beat in the lows every half second, each band's peak held and falling
  spectrum: () => {
    const n = 24, p = W / n, peak = new Float64Array(n)
    let last = 0
    return t => {
      const dt = clamp(t - last, 0, 0.1), bars = []
      last = t
      for (let i = 0; i < n; i++) {
        const f = i / (n - 1), beat = Math.exp(-7 * (t * 2 % 1)) * Math.exp(-3 * f)
        const hum = (0.6 + 0.4 * Math.sin(t * (2.3 + i * 0.7 % 1.9) + i * 2.1)) * (0.75 - 0.5 * f)
        const v = clamp(0.08 + 0.55 * hum + 0.5 * beat, 0.04, 0.95)
        peak[i] = Math.max(v, peak[i] - dt * 0.5)
        const x = i * p + p * 0.18, w = p * 0.64, top = H * (1 - v), cap = H * (1 - peak[i])
        bars.push([x, w, top, H])
        if (top - cap > 5) bars.push([x, w, cap - 3, cap])
      }
      return bars
    }
  },

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

  // a histogram filling: 800 samples of a normal distribution fall into 25 bins over 8 s, held 2 s, then again
  histogram: () => {
    const n = 25, p = W / n, N = 800, T = 10
    return t => {
      const round = Math.floor(t / T), m = Math.min(N, Math.floor((t % T) / 8 * N)), counts = new Array(n).fill(0)
      for (let k = 0; k < m; k++) {
        // Box–Muller on two hashed uniforms: four bins to a standard deviation
        const u = rand(round * 7919 + 2 * k) || 1e-9, v = rand(round * 7919 + 2 * k + 1)
        const b = Math.round(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * 4 + (n - 1) / 2)
        if (b >= 0 && b < n) counts[b]++
      }
      // the middle bin of the whole, 800 / (4·√2π) ≈ 80 samples, reaches nine tenths up
      return counts.flatMap((c, i) => c ? [[i * p + p * 0.12, p * 0.76, Math.max(0, H - c / 80 * 0.9 * H), H]] : [])
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

  // rule 30 (Wolfram, A New Kind of Science, 2002): a cell from the three above it, left xor (centre or right), from
  // one live cell; six rows a second, the newest at the bottom, 40 generations, held, then again
  automaton: () => {
    const cols = 32, rows = 20, c = W / cols, r = H / rows, G = 40
    const gens = [Array.from({ length: cols }, (_, i) => +(i === cols >> 1))]
    for (let g = 1; g < G; g++) { const a = gens[g - 1]; gens.push(a.map((_, i) => a[(i + cols - 1) % cols] ^ (a[i] | a[(i + 1) % cols]))) }
    return t => {
      const last = Math.min(Math.floor(t * 6) % (G + 12), G - 1), bars = []
      for (let row = 0; row < rows; row++) {
        const a = gens[last - (rows - 1 - row)]
        if (a) for (let i = 0, j; i < cols; i = j) {
          for (j = i + 1; j < cols && a[j] === a[i];) j++
          // a run of live cells is one bar
          if (a[i]) bars.push([i * c + 0.6, (j - i) * c - 1.2, row * r + 0.6, (row + 1) * r - 0.6])
        }
      }
      return bars
    }
  },

  // Code 39: WAVEFONT, a module narrow and three wide, ten modules of quiet either side – a camera reads it. It
  // prints, bar after bar, as text is typed; holds; and prints again
  barcode: () => {
    const { bars, width } = code39('WAVEFONT'), s = W / (width + 20), T = 9
    return t => bars.slice(0, Math.ceil(Math.min(1, (t % T) / 2.5) * bars.length)).map(([m, w]) => [(m + 10) * s, w * s, 4, H - 4])
  },

  // the time now: hours, minutes and seconds, a bar for each gone by, the current one growing, a dot for each to come
  clock: () => () => {
    const d = new Date(), s = d.getSeconds() + d.getMilliseconds() / 1000, m = d.getMinutes() + s / 60, h = d.getHours() + m / 60
    const band = (n, v, top, bot) => Array.from({ length: n }, (_, i) => {
      const p = W / n, f = clamp(v - i, 0, 1)
      return [i * p + p * 0.25, p * 0.5, bot - Math.max(1.5, (bot - top) * f), bot]
    })
    return [...band(24, h, 0, 40), ...band(60, m, 55, 95), ...band(60, s, 110, H)]
  },

  // a bubble sort: 24 bars shuffled, a swap every sixteenth of a second, the tallest bubbling right; held, reshuffled
  sorting: () => {
    const n = 24, p = W / n
    const steps = seed => {
      const a = Array.from({ length: n }, (_, i) => i + 1), out = []
      // Fisher–Yates
      for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand(seed * 97 + i) * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
      out.push(a.slice())
      for (let end = n - 1; end > 0; end--) for (let i = 0; i < end; i++) if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]], out.push(a.slice())
      return out
    }
    let seed = 0, seq = steps(0), t0 = 0
    return t => {
      let k = Math.floor((t - t0) * 16)
      if (k < 0 || k >= seq.length + 32) seq = steps(++seed), t0 = t, k = 0
      return seq[Math.min(k, seq.length - 1)].map((v, i) => [i * p + p * 0.15, p * 0.7, H - v / n * H, H])
    }
  },

  // a ripple in halftone: rows of bars, each as wide as the surface is dark there – as the traced pictures are set
  halftone: () => {
    const cols = 24, rows = 10, cw = W / cols, rh = H / rows
    return t => {
      const bars = []
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) * cw, y = (r + 0.5) * rh, d = Math.hypot(x - W / 2, (y - H / 2) * 1.1)
        const w = cw * (0.1 + 0.85 * (0.5 + 0.5 * Math.cos(d / 11 - t * 2.4) * Math.exp(-d / 160)))
        bars.push([x - w / 2, w, r * rh + 0.8, (r + 1) * rh - 0.8])
      }
      return bars
    }
  },

  // box plots of eight drifting samples: whiskers to Tukey's fences, Q3 + 1.5 IQR (normal quantiles: ±2.698 σ), capped;
  // the box the middle half, ±0.674 σ; the median a gap across it
  boxplot: () => {
    const n = 8, p = W / n
    return t => {
      const bars = []
      for (let i = 0; i < n; i++) {
        const mu = H * (0.5 + 0.2 * Math.sin(t * 0.7 + i * 0.9)), sd = H * (0.09 + 0.035 * Math.sin(t * 1.1 + i * 2.3))
        const y = z => clamp(mu - z * sd, 1, H - 1), cx = (i + 0.5) * p, hi = y(2.698), lo = y(-2.698)
        bars.push([cx - 0.7, 1.4, hi, lo], [cx - 5, 10, hi, hi + 1.4], [cx - 5, 10, lo - 1.4, lo])
        bars.push([cx - 9, 18, y(0.674), mu - 1], [cx - 9, 18, mu + 1, y(-0.674)])
      }
      return bars
    }
  },

  // rain: drops falling at their own speeds, each a range bar, one to a column
  rain: () => {
    const n = 30, p = W / n
    return t => {
      const bars = []
      for (let k = 0; k < n; k++) {
        const len = 10 + 28 * rand(3 * k), fall = 50 + 90 * rand(3 * k + 1), y = (t * fall + rand(3 * k + 2) * (H + len)) % (H + len) - len
        const top = Math.max(0, y), bot = Math.min(H, y + len)
        if (bot - top > 1) bars.push([(k % n) * p + p * 0.4, p * 0.2, top, bot])
      }
      return bars
    }
  }
}

/** A scene as a traced piece at time t, fresh for each tile. */
export const scene = name => {
  const at = scenes[name](), frame = { w: W, h: H, slices: [{ y: 0, h: H }] }
  return t => laid(frame, at(t))
}
