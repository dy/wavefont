/**
 * ॐ, engraved: the sign as upright lines, each as wide as the sign is deep where the line crosses it, so its edges
 * thin out softly – the way the flower's picture is drawn. The shape is Eczar Bold's; the lines are Wavefont.
 */
import { draw, laid } from './art.js'
import { omOutline as OM } from './art-data.js'

// the sign in units of its own: 24 lines across, 5 apart – set 96 px wide, a line every 4 px
const W = 120, H = Math.round(W * OM.h / OM.w), PITCH = 5

/** How deep in the sign a point is, 0..1: the share of the square 2r across around it that the sign covers. */
const depth = r => {
  const S = 4, cw = W * S, ch = H * S, c = document.createElement('canvas')
  c.width = cw, c.height = ch
  const g = c.getContext('2d', { willReadFrequently: true }), s = (W - 2) / OM.w * S
  g.translate(S, (ch - OM.h * s) / 2), g.scale(s, s), g.fill(new Path2D(OM.d))
  const a = g.getImageData(0, 0, cw, ch).data, sum = new Float64Array((cw + 1) * (ch + 1))
  for (let y = 0; y < ch; y++) for (let x = 0, run = 0; x < cw; x++) {
    run += a[(y * cw + x) * 4 + 3] / 255
    sum[(y + 1) * (cw + 1) + x + 1] = sum[y * (cw + 1) + x + 1] + run
  }
  const at = (x, y) => sum[Math.min(ch, Math.max(0, Math.round(y * S))) * (cw + 1) + Math.min(cw, Math.max(0, Math.round(x * S)))]
  return (x, y) => (at(x + r, y + r) - at(x - r, y + r) - at(x + r, y - r) + at(x - r, y - r)) / (4 * r * r * S * S)
}

/** The sign as bars: along each line, runs of one width, the width following the depth. */
const engrave = () => {
  const deep = depth(1.5), bars = []
  for (let x = PITCH / 2; x < W; x += PITCH) {
    let from = 0, w = 0
    for (let y = 0; y <= H; y++) {
      const k = y < H ? deep(x, y + 0.5) : 0
      // thin where the sign fades out, four fifths of the pitch deep inside it; in whole units, so runs are few
      const v = k < 0.1 ? 0 : Math.round(PITCH * (0.1 + 0.7 * k))
      if (v === w) continue
      if (w) bars.push([x - w / 2, w, from, y])
      from = y, w = v
    }
  }
  return laid({ w: W, h: H, slices: [{ y: 0, h: H, lines: [] }] }, bars)
}

export function om(el) {
  const piece = engrave()
  // proportions first: set while observed, they would resize what's observed in the middle of its report
  el.dataset.ar = el.style.aspectRatio = `${W} / ${H}`
  new ResizeObserver(([e]) => draw(el, piece, e.contentRect.width)).observe(el)
}
