import test from 'node:test'
import assert from 'node:assert/strict'
import wf, { char, shift, bar, bars, MAX } from './index.js'

test('values → chars', () => {
  assert.equal(wf(0, 1, 50, 99, 127), 'ĀāĲţſ')
  assert.equal(wf([0, 1, 50, 99, 127]), wf(0, 1, 50, 99, 127))
  assert.equal(wf(new Uint8Array([0, 127])), 'Āſ')
  assert.equal(wf(), '')
})

test('clamp & round', () => {
  assert.equal(wf(-5), 'Ā')
  assert.equal(wf(128), 'ſ') // 0x180+ render blank — clamp to MAX
  assert.equal(wf(1e6), 'ſ')
  assert.equal(wf(63.6), 'ŀ')
  assert.equal(wf(NaN), 'Ā')
})

test('large input (beyond args limit)', () => {
  const n = 1 << 20
  const s = wf(new Float32Array(n).fill(100))
  assert.equal(s.length, n)
  assert.equal(s.charCodeAt(0), 0x0100 + 100)
  assert.equal(s.charCodeAt(n - 1), 0x0100 + 100)
})

test('char', () => {
  assert.equal(char(0), 'Ā')
  assert.equal(char(MAX), 'ſ')
})

test('shift: canonical mark order', () => {
  assert.equal(shift(0), '')
  assert.equal(shift(1), '́')
  assert.equal(shift(-1), '̀')
  assert.equal(shift(23), '̂̂́́́')
  assert.equal(shift(-13), '̌̀̀̀')
  assert.equal(shift(100), '̂'.repeat(10))
  assert.equal(shift(-100), '̌'.repeat(10))
  assert.equal(shift(150), '̂'.repeat(10)) // clamps
  assert.equal(shift(9.6), '̂') // rounds to 10
})

test('bar: one code point per level range', () => {
  assert.equal(bar(0, 0).codePointAt(0), 0xF0000)
  assert.equal(bar(10, 20).codePointAt(0), 0xF0000 | 10 << 8 | 20)
  assert.equal(bar(0, MAX).codePointAt(0), 0xF007F)
  assert.equal(bar(20, 10), bar(10, 20)) // either order
  assert.equal(bar(-5, 200), bar(0, MAX)) // clamps
  assert.equal(bar(9.6, 10.4), bar(10, 10)) // rounds
  assert.equal(bar(3, 4).length, 2) // outside the BMP: two UTF-16 units
})

test('bars: arrays of levels', () => {
  assert.equal(bars([0, 10], [MAX, 20]), bar(0, MAX) + bar(10, 20))
  assert.equal(bars(new Float32Array(0), new Float32Array(0)), '')
  const n = 1 << 18, s = bars(new Uint8Array(n).fill(3), new Uint8Array(n).fill(90))
  assert.equal(s.length, 2 * n)
  assert.equal(s.codePointAt(2 * (n - 1)), 0xF0000 | 3 << 8 | 90)
})
