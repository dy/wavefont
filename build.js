/**
 * @module  wavefont/build
 *
 * Build wavefont file
 */

const build = require('./');

let font = build({
	name: 'wavefont',
	spacing: 0,
	symmetrical: false
});
font.download();


font = build({
	name: 'wavefont',
	spacing: 0,
	symmetrical: true
});
font.download();