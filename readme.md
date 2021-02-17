# wavefont

A typeface for rendering data: waveforms, spectrums, diagrams, bars etc.

[![wavefont](https://raw.githubusercontent.com/audio-lab/wavefont/gh-pages/preview.png "wavefont")](http://audio-lab.github.io/wavefont/)

Font provides bar glyphs representing values from 0 to 100 (and clipping 28 values) to map data to.

The charcodes for the data fall under _Latin Extended-A_ unicode category (U+0100-017F), therefore recognized as word boundary in regexps, can be selected by <kbd>Ctrl</kbd> + <kbd>→</kbd> or _double click_.

_Latin_ range is covered with empty values to allow for recognizing the font by system.

Vertical position can be adjusted down via combining accent grave &nbsp;&#x0300; (U+0300) or up via accent acute &nbsp;&#x0301; (U+0301) characters. One accent character adjusts vertical position by 1.

<!-- Font also provides variables: _width_, _align_. -->

## Usage

```html
<style>
	@font-face {
		font-family: "wavefont";
		font-weight: normal;
		src: url("./wavefont.otf");
		font-display: block;
	}
	.wavefont {
		font-style: wavefont;
	}
</style>

<!-- direct values -->
<textarea class="wavefont" cols="100">
	&#x0100;&#x0101;&#x0102;&#x0103;&#x0301;&#x0104;&#x0105; ... &#x017f;
</textarea>
```

<!--
It also ships npm package.

[![npm install wavefont](https://nodei.co/npm/wavefont.png?mini=true)](https://npmjs.org/package/wavefont/)

Include amplitude to letter converter:

```js
import wf from 'wavefont';

let input = document.body.appendChild(document.createElement('input'));
input.style.fontFamily = 'wavefont';

input.value = [0, 1, 2, 3, ... 100].map(wf.encode).join('');
```
 -->
