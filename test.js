/**
 * @module wavefont/test
 *
 * Render waveform typeface in browser
 */
'use strict';

require('enable-mobile');
const css = require('insert-styles');
const uid = require('get-uid');
const Panel = require('settings-panel');
const addFont = require('add-font');
const includeFont = require('./');


document.body.style.overflow = 'hidden';

let fontName = 'wavefont';

// Require way
for (let weight = 100; weight <= 900; weight+=100) {
	includeFont({
		weight: weight,
		type: 'bars',
		css: `
			font-style: normal;
			font-weight: ${weight};
		`
	});
	includeFont({
		weight: weight,
		type: 'bars',
		reflect: true,
		css: `
			font-style: oblique;
			font-weight: ${weight};
		`
	});
	includeFont({
		weight: weight,
		type: 'dots',
		css: `
			font-style: italic;
			font-weight: ${weight};
		`
	});
};


// CSS way
// addFont('./wavefont-bars.otf', 'font-family: wavefont; font-style: normal;');
// addFont('./wavefont-bars-symmetrical.otf', 'font-family: wavefont; font-style: italic;');


// Build way
// const build = require('./index.js');
// fontName = 'wf-' + uid();
// document.fonts.clear();
// addFont(build({
// 	name: fontName,
// 	ratio: 1/64
// }).toArrayBuffer(), `
// 	font-family: ${fontName};
// 	font-weight: 100;
// 	font-style: normal;
// `);
// addFont(build({
// 	name: fontName,
// 	ratio: 1/2
// }).toArrayBuffer(), `
// 	font-family: ${fontName};
// 	font-weight: 900;
// 	font-style: normal;
// `);


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
	font-family: ${fontName};
	width: 100vw;
	height: 100vh;
	line-height: 1;
	letter-spacing: 0px;
	font-size: 72px;
`;


let ghIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="784" height="1024" viewBox="0 0 784 1024"><path d="M4.168 480.005q0 107.053 52.114 194.314 52.114 90.085 141.399 141.799t194.314 51.714q105.441 0 195.126-51.714 89.685-52.114 141.199-141.599t51.514-194.514q0-106.652-51.714-195.126-52.114-89.685-141.599-141.199t-194.514-51.514q-107.053 0-194.314 52.114-90.085 52.114-141.799 141.399t-51.714 194.314zM68.802 480.005q0-64.634 25.451-124.832t69.482-103.828q44.031-44.031 103.828-69.282t124.432-25.251 124.832 25.251 104.229 69.282q43.631 43.631 68.882 103.828t25.251 124.832q0 69.482-28.487 132.504t-79.989 108.876-117.76 66.458v-113.924q0-42.419-34.747-66.257 85.238-7.672 124.632-43.23t39.383-112.712q0-59.786-36.759-100.593 7.272-21.815 7.272-42.018 0-29.899-13.732-54.939-27.063 0-48.478 8.884t-52.515 30.699q-37.571-8.484-77.565-8.484-45.654 0-85.238 9.295-30.299-22.216-52.314-31.311t-49.891-9.084q-13.332 25.451-13.332 54.939 0 21.004 6.871 42.419-36.759 39.594-36.759 100.192 0 77.165 39.183 112.312t125.644 43.23q-23.027 15.355-31.911 44.843-19.792 6.871-41.207 6.871-16.156 0-27.875-7.272-3.636-2.024-6.66-4.236t-6.26-5.448-5.248-5.048-5.248-6.26-4.236-5.659-4.848-6.46-4.236-5.659q-18.991-25.051-45.243-25.051-14.143 0-14.143 6.060 0 2.424 6.871 8.083 12.931 11.308 13.732 12.12 9.696 7.672 10.908 9.696 11.719 14.544 17.779 31.911 22.627 50.502 77.565 50.502 8.884 0 34.747-4.036v85.649q-66.257-20.603-117.76-66.458t-79.989-108.876-28.487-132.504z"></path></svg>`;



let panel = Panel({
	type: {
		type: 'switch',
		label: 'Type',
		options: {'bars': 'bars', 'dots': 'scatter', 'reflected': 'symmetrical'},
		value: 'bars',
		change: v => {
			el.style.fontStyle = v === 'reflected' ? 'oblique' : v === 'dots' ? 'italic' : 'normal';
		}
	},
	width: {
		label: 'Font weight',

		// type: 'switch',
		// value: '400',
		// options: {
		// 	100: '<small style="font-size:.5em; vertical-align: top;">▏</small>',
		// 	200: '<small style="font-size:.5em; vertical-align: top;">▎</small>',
		// 	300: '<small style="font-size:.5em; vertical-align: top;">▍</small>',
		// 	400: '<small style="font-size:.5em; vertical-align: top;">▋</small>',
		// 	500: '<small style="font-size:.5em; vertical-align: top;">▊</small>',
		// 	600: '<small style="font-size:.5em; vertical-align: top;">▉</small>',
		// 	700: '<small style="font-size:.5em; vertical-align: top;">▇</small>',
		// 	800: '<small style="font-size:.5em; vertical-align: top;">▆</small>',
		// 	900: '<small style="font-size:.5em; vertical-align: top;">▅</small>'
		// },
		change: v => {
			el.style.fontWeight = v;
		},

		type: 'range',
		min: 100,
		max: 900,
		step: 100,
		value: 300
	},
	fontSize: {
		label: 'Font size',
		type: 'range',
		value: 64,
		min: 8,
		max: 512,
		step: 1,
		change: v => {
			el.style.fontSize = v + 'px';
		}
	},
	spacing: {
		type: 'range',
		label: 'Letter spacing',
		min: -2,
		max: 10,
		value: 0,
		step: .25,
		change: v => {
			console.log(v + 'px');
			el.style.letterSpacing = v + 'px';
		}
	},
	raw: {label: false, content: '<hr/>'},
	generate: {
		type: 'button',
		label: 'Regenerate data',
		action: v => {
			genData();
		}
	}
}, {
	theme: require('settings-panel/theme/typer'),
	title: `<a href="https://github.com/dfcreative/wavefont" style="margin-left: -1em">Wavefont <span style="position: absolute; opacity: 1; margin-top: .12em; margin-left: .4em; width: .9em; height: .9em;">${ghIcon}</span></a>`,
	css: `
		:host {
			position: absolute;
			z-index: 1;
			top: 50%;
			left: 50%;
			width: 20rem;
			margin-left: -10rem;
			margin-top: -8rem;
		}

		:host .settings-panel-title {
			text-align: center;
		}

		#width .settings-panel-switch-label {
			padding: 0 .75em;
		}

		// :host .settings-panel-checkbox-label {
		// 	position: relative;
		// 	left: 13.2em;
		// }
	`
});


//regenerate data
function genData () {
	let rate = 44100;
	let len = 44100;
	let offset = 0x0200;

	let f1 = 5000 * Math.random();
	let f2 = 3000 * Math.random();
	let f3 = Math.random() * 53 + 17;
	let f4 = Math.random() * 27 + 173;

	let str = '';
	let isZero = false;
	for (let i = .5; i < len; i++) {
		let amp = Math.sin(Math.PI * 2 * i * f1*2 / rate)*.5 + Math.sin(Math.PI * 2 * i * f1*3 / rate)*.25 + Math.sin(Math.PI * 2 * i * f1*4 / rate)*.25;
		// amp *= Math.exp(-i/44100);
		// amp *= Math.sin(Math.PI * 2 * i * 2 * Math.sin(Math.PI * 2 * i * f1*2 / rate) / rate);
		// let amp = Math.random();
		amp *= Math.sin(Math.PI * 2 * i * f2*2 / rate + 13 * Math.sin(Math.PI * 2 * i * f2*.08 / rate));

		//spacer sins
		let spacerAmp1 =  Math.max(Math.sin(Math.PI * 2 * i * f3 * 2 / rate  + 1) * .5 + .49, 0);
		let spacerAmp2 = Math.max(Math.sin(Math.PI * 2 * i * f4 * 2 / rate  + 3) * .5 + .49, 0);
		amp *= spacerAmp1;
		amp *= spacerAmp2;

		//insert spaces where spacer amp is low
		let idx
		if (!spacerAmp1 || !spacerAmp2) {
			idx = isZero ? 0x0020 : 0x007c;
			isZero = true;
		}
		else {
			isZero = false;
			idx = Math.floor(offset + amp * 127);
		}

		str += String.fromCharCode(idx);
	}

	el.value = str;
}
genData();