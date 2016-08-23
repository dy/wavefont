/**
 * @module wavefont/test
 *
 * Render waveform typeface in browser
 */
'use strict';

require('enable-mobile');
const css = require('insert-styles');
const build = require('./build');
const uid = require('get-uid');

css(`
	@font-face {
		font-family: "wavefont";
		src: url("./wavefont-bars.otf");
	}
`);

document.body.style.overflow = 'hidden';


let id = uid();

addToFonts(build({name: `wf-${id}`}).toArrayBuffer(), `wf-${id}`);


//add font to included font-faces
function addToFonts (buffer, id) {
	//CSS fonts API
	//TODO: document.fonts.delete(fontface↓)
	document.fonts.clear();

	let fontface = new window.FontFace(id, buffer)

	if ( fontface.status === 'error' ) {
		throw new Error('Fontface is invalid and cannot be displayed');
	}

	document.fonts.add( fontface );
};



//create preview canvas
// let canvas = document.body.appendChild(document.createElement('canvas'));
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight/2;
// let context = canvas.getContext('2d');
// canvas.style.cssText = `
// 	position: absolute;
// 	top: 0;
// 	left: 0;
// 	right: 0;
// 	opacity: .85;
// 	pointer-events: none;
// `;
// for (var i = 0; i < font2.glyphs.length; i++) {
// 	var glyph = font2.glyphs.get(i);
// 	var x = i*10 + 60;
// 	var y = 60;
// 	var fontSize = 50;
// 	glyph.draw(context, x, y, fontSize);
// 	glyph.drawPoints(context, x, y, fontSize);
// 	glyph.drawMetrics(context, x, y, fontSize);
// }


//draw natural ranges with sine
let el = document.body.appendChild(document.createElement('textarea'));
el.style.cssText = `
	font-family: "wf-${id}";
	width: 100vw;
	height: 100vh;
	line-height: 1;
	letter-spacing: 0px;
	font-size: 72px;
`;
let str = '';

let len = 44100;
let offset = 0x0200;
for (let i = .5; i < len; i++) {
	let amp = Math.sin(Math.PI * 2 * i / 50) * .5;
	// let amp = Math.random();
	let idx = Math.floor(offset + amp * 127);
	str += String.fromCharCode(idx);
}


// for (let i = 0x200 - 0x7f; i < 0x200 + 0x7f; i++) {
// 	str += String.fromCharCode(i);
// }


el.innerHTML = str;