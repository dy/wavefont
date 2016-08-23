# wavefont

A typeface for rendering data: waveforms, spectrums, diagrams, bars etc.

The character codes fall under _Letters_ unicode category, in that the characters are recognized as word boundary in regexps and can be selected by <kbd>Ctrl</kbd> + <kbd>→</kbd> or _double click_ anywhere where the font is used.

Latin set is covered with empty values to allow for recognizing the font by system.

## Usage

Include font as a css directive:

```css
@font-face {
	font-family: "wavefont";
	font-weight: normal;
	src: url("./wavefont.otf");
}
```

Use `0x100` offset for characters:

```js
//classic UTF
'\u0100'; //-128
'\u0101'; //-127
...
'\u017f'; //-1
'\u0180'; //0
'\u0181'; //1
...
'\u01ff'; //127

//ES6 UTF
`\u{100}`;
`\u{101}`;
...
`\u{1ff}`;

//Programmatically
String.fromCharCode(0x100);
String.fromCharCode(0x101);
...
String.fromCharCode(0x100 + );
```

Available styles (coming soon):

* wavefont-light
* wavefont-regular
* wavefont-bold
* wavefont-symmetrical
* wavefont-dots-symmetrical
* wavefont-dashes-symmetrical
* wavefont-outline-symmetrical


## Building

To build or debug own wavefont, `npm install wavefont` and do

```js
const build = require('wavefont');

let font = build({
	width: 10,
	height: 20,
	range: [],
	symmetrical: true
});
```

`font` now is an _ArrayBuffer_ object, you can set attach it to window fonts or output to stdout.

## Credits

[opentype.js]() covers technical details of generating font.