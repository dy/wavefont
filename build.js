/**
 * @module  wavefont/build
 *
 * Build wavefont file
 */

const build = require('./');

let font = build({
	name: 'wavefont'
});

font.download();