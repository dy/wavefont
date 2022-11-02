/**
 * @module  wavefont
 */

const low = (...values) => String.fromCharCode(...values.map(value => Math.floor(Math.min(Math.max(value, 0), 100)) + 0x100))
const center = (...values) => String.fromCharCode(...values.map(value => Math.floor(Math.min(Math.max(value, 0), 100)) + 0x400))


export { low, center }