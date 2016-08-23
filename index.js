/**
 * @module  wavefont
 *
 * Wavefont generator
 */
'use strict';

const extend = require('just-extend');
const opentype = require('opentype.js');
const uid = require('get-uid');
const clamp = require('mumath/clamp');

module.exports = createWavefont;


//build wavefont from options
function createWavefont (opts) {
	opts = extend({
		name: 'wavefont',

		//shift advanceWidth to the amount
		spacing: -1.35,

		//letter width/height proportion
		ratio: 1/64,

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
		type: 'bars',

		//values outside the range
		clip: 1.5,

		//width for spacers
		shortWidth: .15
	}, opts);


	//height/width of glyph
	let width = opts.levels * opts.ratio;
	let middle = opts.levels / 2;

	//paint amplitudes font
	let glyphs = [];

	let spacePath = new opentype.Path();
	spacePath.moveTo(0, 0);
	spacePath.lineTo(width*opts.shortWidth, 0);
	spacePath.lineTo(width*opts.shortWidth, 1);
	spacePath.lineTo(0, 1);

	//advanceWidth always takes +1px, to compensate we have to increase width by 1.
	let notDefGlyph = new opentype.Glyph({
		name: '.notdef',
		advanceWidth: width + opts.spacing,
		path: spacePath
	});


	let extMiddle = Math.round(middle*opts.clip);

	//draw -128..127 range
	//clip values outside the range
	for (let offset = -extMiddle; offset < extMiddle; offset++) {
		let path;
		if (!offset) {
			path = spacePath;
		}

		else {
			path = new opentype.Path();
			let top = clamp(offset, -middle, middle);
			let bottom = opts.symmetrical ? -top : 0;

			path.moveTo(0, bottom);
			path.lineTo(offset ? width : width*opts.shortWidth, bottom);
			path.lineTo(offset ? width : width*opts.shortWidth, top);
			path.lineTo(0, top);
		}

		let glyph = new opentype.Glyph({
			name: String.fromCharCode(opts.offset + offset),
			unicode: opts.offset + offset,
			advanceWidth: width + opts.spacing,
			path: path,
			// xMin: -width/2,
			// yMin: -height,
			// xMax: width/2,
			// yMax: height
		});
		glyphs.push(glyph);
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
			advanceWidth: width + opts.spacing,
			path: spacePath
		});

		glyphs.push(glyph);
	}


	//create font
	let font = new opentype.Font({
		familyName: opts.name,
		styleName: opts.type + (opts.symmetrical ? 'symmetrical' : ''),
		unitsPerEm: opts.levels,
		ascender: middle - 1,
		descender: -middle,
		glyphs: glyphs
	});


	//append substitutions
	// console.log(font.toTables());

	return font;
}
