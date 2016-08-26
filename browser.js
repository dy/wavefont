/**
 * @module  wavefont/browser
 *
 * Include wavefont for the page
 */

'use strict';

module.exports = fromAmplitude;

function fromAmplitude (amp) {
	offset = 0x0200;
	return String.fromCharCode(offset + Math.floor(amp*127));
}