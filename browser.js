/**
 * @module  wavefont/browser
 *
 * Include wavefont for the page
 */

const css = require('insert-styles');

module.exports = fromAmplitude;

function includeFont (opts) {
	opts = opts || {};

	let offset = 0x0200;

	css(`
		@font-face {
			font-family: wavefont;
			src: url(./wavefont.otf) format(opentype);
		}
	`, {id: });

	return function fromAmplitude (amp) {
		return String.fromCharCode(offset + Math.floor(amp*127));
	}
}
