/**
 * @module  wavefont
 *
 * Wavefont generator
 */
'use strict';

const extend = require('just-extend');
const opentype = require('opentype.js');
const uid = require('get-uid');

module.exports = createWavefont;


//TODO: add ligatures for height offset, by levels


//build wavefont from options
function createWavefont (opts) {
	opts = extend({
		name: 'wavefont',

		//shift advanceWidth to the amount
		shift: -1,

		//letter proportion
		//height/width proportion
		ratio: 1/48,

		//unicode range start
		//ideally the letter range, good ones (for 255 levels):
		//0x0100, 0x1100, 0x1500 0x1e00, 0xa000, 0xb000, 0xc000, 0xd000
		//symmetrical offset is 0x0200
		offset: 0x0200,

		//number of amplitude levels
		//values span from -128..-1 and 0..127
		levels: 256,

		//symmetrical mode
		symmetrical: false,

		//style - bars, line, dashes, dots
		type: 'bars'
	}, opts);


	//height/width of glyph
	let width = opts.levels * opts.ratio;

	//paint amplitudes font
	let glyphs = [];

	//advanceWidth always takes +1px, to compensate we have to increase width by 1.
	let notDefGlyph = new opentype.Glyph({
		name: '.notdef',
		advanceWidth: width + opts.shift,
		path: new opentype.Path()
	});

	//mode makes symm symbols
	if (opts.symmetrical) {

	}
	else {
		let middle = opts.levels / 2;

		//draw lower range
		for (let i = 0; i < opts.levels; i++) {
			let h = i - middle;

			let path = new opentype.Path();
			path.moveTo(0, 0);
			path.lineTo(width, 0);
			path.lineTo(width, h);
			path.lineTo(0, h);
			let glyph = new opentype.Glyph({
				name: i,
				index: i,
				unicode: opts.offset + h,
				advanceWidth: width + opts.shift,
				path: path,
				// xMin: -width/2,
				// yMin: -height,
				// xMax: width/2,
				// yMax: height
			});
			glyphs.push(glyph);
		}
	}

	glyphs.push(notDefGlyph);


	//stub latin subset
	for (let offset = 0x0020; offset < 0x007f; offset++) {
		let name = String.fromCharCode(offset);
		if (name === ' ') name = 'space';
		if (name === '_') name = 'underscore';
		if (name === '.') name = 'period';
		let glyph = new opentype.Glyph({
			name: name,
			unicode: offset,
			advanceWidth: width + opts.shift,
			path: new opentype.Path()
		});

		glyphs.push(glyph);
	}


	//create font
	return new opentype.Font({
		familyName: opts.name,
		styleName: opts.type + (opts.symmetrical ? 'symmetrical' : ''),
		unitsPerEm: opts.levels,
		ascender: opts.levels/2,
		descender: -opts.levels/2,
		glyphs: glyphs
	});

	// console.log(font.toTables());
	// var buffer = font.toArrayBuffer();
	// var font2 = opentype.parse(buffer);
	// font.download();
}
