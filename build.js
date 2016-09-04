/**
 * @module  wavefont/build
 *
 * Build basic wavefont files
 */
'use strict';

const build = require('./font');
const fs = require('fs');
const path = require('path');


let ratios = {
	900: 1/6,
	800: 1/8,
	700: 1/12,
	600: 1/16,
	500: 1/24,
	400: 1/32,
	300: 1/48,
	200: 1/64,
	100: 1/128
};
let types = ['bars', 'dots'];

console.log('Building wavefonts...');

let dir = __dirname + path.sep + 'font' + path.sep;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (let weight in ratios) {
	let ratio = ratios[weight];
	types.forEach((type) => {
		//normal
		let font = build({
			name: `wavefont`,
			postfix: weight,
			ratio: ratio,
			type: type
		});
		font.download();
		// console.log(`wavefont-${type}-${weight} is done`);

		//reflected
		font = build({
			name: `wavefont`,
			postfix: weight,
			ratio: ratio,
			type: type,
			reflect: true
		});
		font.download();
		// console.log(`wavefont-${type}-reflected-${weight} is done`);

		let fontName = `wavefont-${type}-${weight}.otf`;
		fs.rename(fontName, dir + fontName);
		fontName = `wavefont-${type}-reflected-${weight}.otf`;
		fs.rename(fontName, dir + fontName);
	});
}
console.log(`Wavefonts placed to '${dir}'`);
