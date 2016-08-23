# wavefont

A typeface for rendering data: waveforms, spectrums, diagrams, bars etc.

The charcodes for the data fall under _Letters_ unicode category, therefore recognized as word boundary in regexps and can be selected by <kbd>Ctrl</kbd> + <kbd>→</kbd> or _double click_ .

Latin set is covered with empty values to allow for recognizing the font by system.

[![wavefont](https://raw.githubusercontent.com/dfcreative/wavefont/gh-pages/preview.png "wavefont")](http://dfcreative.github.io/wavefont/)

Available styles (coming soon):

* wavefont-symmetrical
* wavefont-light
* wavefont-regular
* wavefont-bold
* wavefont-dots
* wavefont-dashes
* wavefont-outline


## Usage

Include font as a css directive:

```css
@font-face {
	font-family: "wavefont";
	font-weight: normal;
	src: url("./wavefont-bars.otf");
}
```

There are 256 characters available for the levels of amplitude from `-128..127` range.
Use `0x200` offset for `0` level of amplitude:

```js
//Strings
'\u0180'; //-128
//...
'\u01fe'; //-1
'\u01ff'; //-1
'\u0200'; //0
'\u0201'; //1
'\u0202'; //2
//...
'\u027f'; //127

//ES6 strings
`\u{200}`; //0
`\u{201}`; //1
//...
`\u{27f}`; //127

//Programmatically
let char = String.fromCharCode(0x200 + level);
```

Or you can use [add-font](https://npmjs.org/package/font) package, which inserts font to css from url or as a buffer.


## Building

To build or debug own wavefont:

`npm install wavefont`

You get builder function, available in node or browser:

```js
const createFont = require('wavefont');

let font = createFont({
	width: 10,
	height: 20,
	range: [],
	symmetrical: true
});

//will download or create font
font.download();
```

`font` now is an _opentype.Font_ instance, you can attach it to window fonts with [add-font](https://npmjs.org/package/add-font), output to stdout, download etc, see [opentype.js](https://github.com/nodebox/opentype.js) for reference.


## Credits

> [opentype.js](https://github.com/nodebox/opentype.js) — covers technical details of generating OpenType font.<br/>