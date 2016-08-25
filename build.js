/**
 * @module  wavefont/build
 *
 * Build wavefont file
 */

const build = require('./');
const fs = require('fs');


let widths = {
	bolder: 1/8,
	bold: 1/16,
	normal: 1/32,
	light: 1/64,
	lighter: 1/128
};
let types = ['bars', 'dashes', 'line', 'dots'];


for (let width in widths) {
	let ratio = widths[width];
	types.forEach((type) => {
		//normal
		let font = build({
			name: `wavefont-${width}`,
			ratio: ratio,
			type: type
		});
		font.download();

		//reflected
		font = build({
			name: `wavefont-${width}`,
			ratio: ratio,
			type: type,
			reflect: true
		});
		font.download();

		let fontName = `wavefont-${width}-${type}.otf`;
		fs.rename(fontName, __dirname + '/font/' + fontName);
		fontName = `wavefont-${width}-${type}-reflected.otf`;
		fs.rename(fontName, __dirname + '/font/' + fontName);
	});
}