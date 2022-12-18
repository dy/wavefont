/**
 * @module  wavefont
 */

export default (...values) => String.fromCharCode(...values.map(value => Math.floor(Math.min(Math.max(value, 0), 100)) + 0x100))
