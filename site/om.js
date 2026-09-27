/**
 * ॐ over the flower. The flower is drawn as its picture was – white lines whose widths make the image – and dimmed;
 * the sign is engraved on the same lines, each as wide as the sign is deep where the line crosses it,
 * so its edges thin out softly. The sign's shape is Eczar Bold's; all of it is text set in Wavefont.
 */
import { draw, laid } from './art.js'
import { art as ART, omOutline as OM } from './art-data.js'

const FLOWER = ART.figure, PITCH = 10 // px of the trace: the flower's lines stand this far apart

/** The flower's lines: where each stands, the middle of the ink around it. */
const lines = () => {
  const ink = new Float64Array(FLOWER.w)
  for (const line of FLOWER.slices[0].lines) for (let i = 0; i < line.length; i += 4) {
    for (let x = Math.floor(line[i]); x < Math.ceil(line[i] + line[i + 1]); x++) ink[x] += line[i + 3] - line[i + 2]
  }
  // the lines' phase, from the ink averaged round the pitch; each line's middle, from the ink within half a pitch of it
  let c = 0, s = 0
  ink.forEach((v, x) => { c += v * Math.cos(2 * Math.PI * (x + 0.5) / PITCH), s += v * Math.sin(2 * Math.PI * (x + 0.5) / PITCH) })
  const phase = (Math.atan2(s, c) / (2 * Math.PI) * PITCH + PITCH) % PITCH, out = []
  for (let at = phase; at < FLOWER.w; at += PITCH) {
    let sum = 0, mid = 0
    for (let x = Math.max(0, Math.ceil(at - PITCH / 2)); x < Math.min(FLOWER.w, at + PITCH / 2); x++) sum += ink[x], mid += ink[x] * (x + 0.5)
    if (sum) out.push(mid / sum)
  }
  return out
}

/** How deep in the sign a point of the flower is, 0..1: the share of the square 2r across around it that the sign covers. */
const depth = (d, r) => {
  const S = 2, W = FLOWER.w * S, H = FLOWER.h * S, c = document.createElement('canvas')
  c.width = W, c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })
  g.scale(S, S), g.fill(new Path2D(d))
  const a = g.getImageData(0, 0, W, H).data, sum = new Float64Array((W + 1) * (H + 1))
  for (let y = 0; y < H; y++) for (let x = 0, run = 0; x < W; x++) {
    run += a[(y * W + x) * 4 + 3] / 255
    sum[(y + 1) * (W + 1) + x + 1] = sum[y * (W + 1) + x + 1] + run
  }
  const at = (x, y) => sum[Math.min(H, Math.max(0, Math.round(y * S))) * (W + 1) + Math.min(W, Math.max(0, Math.round(x * S)))]
  return (x, y) => (at(x + r, y + r) - at(x - r, y + r) - at(x + r, y - r) + at(x - r, y - r)) / (4 * r * r * S * S)
}

/** The sign's outline, `size` wide, its middle at cx, cy: in pixels of the trace. */
const sign = (size, cx, cy) => {
  const s = size / OM.w, ox = cx - size / 2, oy = cy - OM.h * s / 2
  let k = 0
  return OM.d.replace(/-?\d+(?:\.\d+)?/g, v => +(k++ % 2 ? oy + v * s : ox + v * s).toFixed(2))
}

/** The sign as bars on the flower's lines: along each line, runs of one width, the width following the depth. */
const engrave = () => {
  const deep = depth(sign(FLOWER.w * 0.86, FLOWER.w / 2, FLOWER.h * 0.5), 3), bars = []
  for (const x of lines()) {
    let from = 0, w = 0
    for (let y = 0; y <= FLOWER.h; y++) {
      const k = y < FLOWER.h ? deep(x, y + 0.5) : 0
      // a tenth of the pitch at the sign's rim, eight tenths deep inside it; in whole steps, so runs are few
      const v = k < 0.1 ? 0 : Math.round(PITCH * (0.1 + 0.7 * k))
      if (v === w) continue
      if (w) bars.push([x - w / 2, w, from, y])
      from = y, w = v
    }
  }
  return laid(FLOWER, bars)
}

export function om(el) {
  const flower = el.querySelector('.flower'), mark = el.querySelector('.sign'), engraved = engrave()
  // proportions first: set while observed, they would resize what's observed in the middle of its report
  el.style.setProperty('--ar', (FLOWER.w / FLOWER.h).toFixed(4))
  for (const p of [flower, mark]) p.dataset.ar = p.style.aspectRatio = `${FLOWER.w} / ${FLOWER.h}`
  new ResizeObserver(([e]) => {
    const w = e.contentRect.width
    draw(flower, FLOWER, w), draw(mark, engraved, w)
  }).observe(flower)
}
