/**
 * @module  wavefont/build
 *
 * Build a webfont based of options
 */
'use strict';

const extend = require('just-extend');
const opentype = require('opentype.js');
const uid = require('get-uid');

module.exports = build;


//TODO: add ligatures for height offset, by levels


//build wavefont from options
function build (opts) {
	opts = extend({
		name: 'wavefont',

		//letter proportion
		ratio: 4/128,

		//unicode range start
		//ideally the letter range, good ones (for 255 levels):
		//0x0100, 0x1100, 0x1500 0x1e00, 0xa000, 0xb000, 0xc000, 0xd000
		//symmetrical offset is 0x0200
		offset: 0x0200,

		//number of amplitude levels
		levels: 256,

		//symmetrical mode
		symmetrical: false,

		//style - bars, line, dashes, dots
		type: 'bars'
	}, opts);


	//values span from -128..-1 and 0..127
	//style defines symmetrical or side
	//width defines height/width proportion
	//advanceWidth always takes +1px, to compensate we have to increase width by 1.
	var notdefGlyph = new opentype.Glyph({
		name: '.notdef',
		unicode: 0,
		advanceWidth: 0,
		path: null
	});

	//height/width of glyph
	let width = opts.levels * opts.ratio;
	let offsetIdx = 0;

	//paint amplitudes font
	let glyphs = [];

	//treat mode
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
				advanceWidth: width - 1,
				path: path,
				// xMin: -width/2,
				// yMin: -height,
				// xMax: width/2,
				// yMax: height
			});
			glyphs.push(glyph);
		}
	}


	//create font
	return new opentype.Font({
		familyName: opts.name,
		styleName: opts.type,
		unitsPerEm: opts.levels,
		ascender: opts.levels/2 - 1,
		descender: -opts.levels/2,
		glyphs: glyphs
	});

	// console.log(font.toTables());
	// var buffer = font.toArrayBuffer();
	// var font2 = opentype.parse(buffer);
	// font.download();
}
