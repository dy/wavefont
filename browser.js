/**
 * @module  wavefont/browser
 *
 * Include wavefont for the page
 */

'use strict';

const css = require('insert-styles');

module.exports = includeFont;
includeFont.fromAmplitude = fromAmplitude;


function includeFont (opts) {
	opts = opts || {};

	let type = opts.type || 'bars';
	let reflect = opts.reflect || false;
	let weight = opts.weight === 'bold' ? 700 : opts.weight === 'normal' ? 400 : opts.weight || 400;
	let desc = opts.css || '';
	let name = opts.name || 'wavefont';
	let fileName = `wavefont-${type}${reflect ? '-reflected' : ''}-${weight}`;
	let path = opts.path || './font';
	if (!/\\\//.test(path[path.length - 1])) {
		path += '/';
	}

	css(`
		@font-face {
			font-family: ${name};
			src: url("${path}${ fileName }.otf") format("opentype");
			${desc}
		}
	`, {id: fileName});

	return fromAmplitude;
}

function fromAmplitude (amp) {
	offset = 0x0200;
	return String.fromCharCode(offset + Math.floor(amp*127));
}