/**
 * @module  wavefont
 *
 */

export default function fromAmplitude (amp) {
	let offset = 0x0200;
	return String.fromCharCode(offset + Math.floor(Math.min(Math.max(amp, -1), 1)*127));
}
