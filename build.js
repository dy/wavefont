/**
 * @module  wavefont/build
 *
 * Build wavefont file
 */

const build = require('./');

//TODO: parse args

let font = build({
	name: 'wavefont'
});

font.download();