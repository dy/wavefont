/**
 * @module wavefont
 * Values → wavefont string: 0–127 map to chars U+0100–U+017F.
 * Level ranges → one char per bar: U+F0000 | lo << 8 | hi.
 */

/** Max value a single char can encode (higher codepoints render blank). */
export const MAX = 127

const BASE = 0x0100, RANGE = 0xF0000, CHUNK = 8192

const clamp = v => Math.round(Math.min(Math.max(v || 0, 0), MAX))

/**
 * Char for a single value.
 * @param {number} value 0–127, clamped & rounded
 * @returns {string} char in U+0100–U+017F
 */
export const char = value => String.fromCharCode(BASE + clamp(value))

/**
 * Char for a bar spanning levels lo..hi: U+F0000 | lo << 8 | hi, one precomposed glyph.
 * No combining marks, so text lays out like plain text – several times faster than
 * char + shift, most in Safari. Level 64 is the middle of the line; YELA does not apply.
 * Samples min..max in −1..1 are levels 64 × (min + 1) .. 64 × (max + 1).
 * @param {number} lo 0–127, clamped & rounded
 * @param {number} hi 0–127, clamped & rounded; either order
 * @returns {string} one code point: two UTF-16 units
 */
export const bar = (lo, hi) => String.fromCodePoint(range(lo, hi))

const range = (lo, hi) => {
  lo = clamp(lo), hi = clamp(hi)
  return RANGE | Math.min(lo, hi) << 8 | Math.max(lo, hi)
}

/**
 * Wavefont string of bars spanning lo[i]..hi[i].
 * @param {ArrayLike<number>} lo levels 0–127
 * @param {ArrayLike<number>} hi levels 0–127, as many as lo
 * @returns {string}
 */
export const bars = (lo, hi) => {
  let out = ''
  for (let i = 0, n = lo.length; i < n; i += CHUNK) {
    const end = Math.min(i + CHUNK, n), codes = new Array(end - i)
    for (let j = i; j < end; j++) codes[j - i] = range(lo[j], hi[j])
    out += String.fromCodePoint(...codes)
  }
  return out
}

/**
 * Combining marks shifting the preceding bar by ±steps.
 * Emits the canonical order the font recognizes: 10-step marks first, then 1-step marks
 * (up: U+0302 then U+0301, down: U+030C then U+0300), up to ±100.
 * Unordered runs are ignored by the font past the first 10 steps.
 * @param {number} steps −100..100, clamped & rounded
 * @returns {string}
 */
export const shift = steps => {
  steps = Math.round(Math.min(Math.max(steps || 0, -100), 100))
  if (!steps) return ''
  const n = Math.abs(steps), [ten, one] = steps > 0 ? ['\u0302', '\u0301'] : ['\u030C', '\u0300']
  return ten.repeat(n / 10 | 0) + one.repeat(n % 10)
}

/**
 * Wavefont string for values.
 * @param {...number | ArrayLike<number>} values numbers 0–127, or a single (typed) array of them
 * @returns {string}
 */
export default (...values) => {
  const v = values.length === 1 && typeof values[0] === 'object' && values[0] !== null ? values[0] : values
  let out = ''
  for (let i = 0, n = v.length; i < n; i += CHUNK) {
    const end = Math.min(i + CHUNK, n), codes = new Array(end - i)
    for (let j = i; j < end; j++) codes[j - i] = BASE + clamp(v[j])
    out += String.fromCharCode(...codes)
  }
  return out
}
