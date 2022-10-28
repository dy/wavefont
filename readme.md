# wavefont

A typeface for rendering data: waveforms, spectrums, diagrams, bars etc.
Renders 0..100 values from 0x100..0x164 unicode range.

* [Demo](https://dy.github.io/wavefont)
* [v-fonts/wavefont](https://v-fonts.com/fonts/wavefont).

<a href="https://a-vis.github.io/wavefont"><img src="./preview.png" width="240px"/></a>

## Usage

<!-- Get [wavefont.otf](./wavefont.otf) or [wavefont.ttf](./wavefont.ttf). -->
Put [_wavefont.woff2_](./wavefont.woff2) into your project directory and use this code:

```html
<style>
	@font-face {
		font-family: wavefont;
		src: url(./wavefont.woff2) format('woff2');
	}
	@font-face {
		font-family: blank;
		/* src: url(./AdobeBlank2VF.ttf.woff2); */
		src: url(data:application/x-font-woff;charset=utf-8;base64,d09GMgABAAAAAARMABMAAAAAC1AAAAPjAAEAxQAAAAAAAAAAAAAAAAAAAAAAAAAAGUYcID9IVkFSVAZgP1NUQVQkP1ZWQVJjAIIAL0YKWFwwLgE2AiQDCAsGAAQgBYsyBzEXJBgIGwEKEcXkJfmqgCdD4yWAULaeeBovVzstIc6riunXpnmtXivg+BLWsFA1x8PTXP+eO5PNAn8AUCwJsYCgqxxZ1JUELrLsXkOo3TUpDjbRB8Tvo61HSFe6NVBVO1SvlxDEvYxsxE4DfNN8ImIOJ0gqtv/9fq0+Wat/NsTds46FRuqU8lf0gse1iqY3dLfkGRqhqiTVConpREoxCY1FPHelp1Ny+uwFWpZYoBA7dh04oaUEhFLUFDri7o2bj2BaFYGOOeZ1vLhvdQ0IMAUABHoC6yWZLbYAgJ9NX06XhIBcaa5iDdL76Qz2k7njkrV+ci1cx5uLNbeOtx22hbrOrMaqxrO/9QL9NwVgAUJoSZgClkjP3HjyTmDP7j0nIoQAM3AGAJfCk0F+cI8EIeugpw/+AUwGvq0R/IaJbxBM/EE9gRAIQEJCRkaBAg00UKJEE0200EIbbXTQQRdd9NBDH30MMMAQQ4wwEuEmSaYkBnnYDCBXEDnpwW9EJK5WZJBAgQZGmA0oQIMiXw91sjku790e3LzZfHZ461Z5+/ozFVTN2diLFz9/ql67cl8k+nvMWO4OBBKYtXsY6LwaespXbYFXt+TqtTcIhK83bvTx5eGGf1s5V/D9qt/p9najlt/Mj6KUQFCxsYrB4sZY4VoloVbYkpHGKGGx3RT/yaJo4wSfCEucQDLwLLLV3u5asKHhhk9QmpVZaOnEerTNyqaunQW61ucM+umj+BAD6xtRwIJe7SdfPJ0j6BTPIkzxelO3WVhf//c2jpwWnwkGXVHJ7/FoDWDAQVkQ+OBTFKZJu8lXljDZnk7YqITmExH/y0MxUyoCDOBqChwdIU8mZhKKCJ2upGVgbGinpSoKOgThuVdIkAJUCkD1UYqNlj3J5kSRrqElYYogo7sLvSE3eCVefdEJa/SRA1H0BWVMIMAKSoG1TMqBSbtr5Q+DNGe+gASmqJQCTiiX8mISEDDtHgvYUEpCDjCuCZD0oQJ1YQ3sjHRPlXdfK+E/rSY28Bg4cI6cV00RDZaMcjGklsyXggUDJ2BRVwCGvwLAfxa/WTib27k4LwoOHB0NbJMLE/HNdo7AyM7W2AINfIZwPg2I0KNAtGALqE+jIEEkfiTfWAAkgSiiBZJkLDgSCXf6EaZ2NnDRspAUq7MFXOYSaLDGnozJK4dkPCmTRSmRKSxxWiDAMFMxKVLnoZ7iPA0oLgj+UBlRkrmlg3DbW9ieSDMnJbu4KqNIxL1kjISZ9GjJ5+t2TALq0U3AcYLmZeFeX9Ww6+F30lD/+kXetcg6ZJg3EalzO/5jvn7dbo3cSO6f/4dc8dJzzBkJMwsAAAA=) format('woff2');
	}

	.wavefont {
		font-family: wavefont, blank;
		--wdth: 10;
		font-variation-settings: 'wdth' var(--wdth), 'algn' 0.5, 'radi' 30;
	}
</style>

<textarea id="waveform" class="wavefont" cols="100"></textarea>

<script>
	values = [...Array(5).keys()] // create your input values from 0..108 range
	waveform.textContent = values.map(v => String.fromCharCode(0x100 + v)).join('')
</script>
```

<!--
For more advanced use-cases see below.

## Font-faces

Wavefont provides font-faces with various size/range balance, you can include only needed one or automatically select from multiple.

Face 																					| Size 	| Values 				| Characters		| Value → character
---|---|---|---|---
[_wavefont10.woff2_](./wavefont10.woff2) 			| 5kb 	| 0-10 					| 0-10 					| `value`
[_wavefont16.woff2_](./wavefont16.woff2) 			| 10kb 	| 0x0-0xF			 	| 0-10, a-f 		| `value.toString(16)`
[_wavefont100.woff2_](./wavefont100.woff2) 		| 30kb 	| 0-100		 			| U+0100-0200 	| `String.fromCharCode(0x100 + value)`
[_wavefont255.woff2_](./wavefont255.woff2) 		| 50kb	| 0-255					| U+0100-03FF 	| `String.fromCharCode(0x100 + value)`
[_wavefont1000.woff2_](./wavefont1000.woff2) 	| 100kb	| 0-1000 				| U+E000-E8FF 	| `String.fromCharCode(0xe000 + value)`
[_wavefont.woff2_](./wavefont.woff2)		 			| 100kb	| all ↑					| all ↑				 	| any ↑
-->
<!--
## Autoselect font-face

To include multiple font-faces (for various ranges), use _unicode-range_ to scope characters and save bandwidth:

```css
/* 0-10 */
@font-face {
	font-family: wavefont;
	src: url(./wavefont10.woff2) format('woff2');
	unicode-range: U+0020-007E;
}
/* 0-16 */
@font-face {
	font-family: wavefont;
	src: url(./wavefont16.woff2) format('woff2');
	unicode-range: U+0020-007E;
}
/* 0-100 */
@font-face {
	font-family: wavefont;
	src: url(./wavefont100.woff2) format('woff2');
	unicode-range: U+00F8-02AF;
}
/* 0-255 */
@font-face {
	font-family: wavefont;
	src: url(./wavefont255.woff2) format('woff2');
	unicode-range: U+00F8-02AF;
}
/* 0-1000 */
@font-face {
	font-family: wavefont;
	src: url(./wavefont1000.woff2) format('woff2');
	unicode-range: U+E000-E8FF;
}
```
-->

<!--
## Avoid FOUT

To avoid flash of system font (aka [FOUT](https://css-tricks.com/fout-foit-foft/)), use [blank](https://github.com/adobe-fonts/adobe-blank-vf) font-face fallback:

```css
@font-face {
	font-family: blank;
	/* src: url(adobe-blank-v2) format('woff2'); */
	src: url(blobUrl://abcdef) format('woff2');
}
.wavefont {
	font-style: wavefont, blank;
}
```
-->

## Variable features

Tag | Range | Meaning
---|---|---
`wdth` | _1_-_1000_ | Bar width (in upm).
`algn` | _0_-_1_ | _0_ for bottom align, _0.5_ for center and _1_ for top align.
`radi` | _0_-_50_ | Border radius, percentage of glyph width.

<!-- `ampl` | _0_-_1_ | Amplitude (height) or bars. -->

## Hints

* Charcodes fall under marking characters unicode category, ie. recognized as word by regexp and can be selected with <kbd>Ctrl</kbd> + <kbd>→</kbd> / double click.
* Vertical position of a bar can be adjusted via combining accent grave <kbd>&nbsp;&#x0300;</kbd> (U+0300) or accent acute <kbd>&nbsp;&#x0301;</kbd> (U+0301) for down/up shift correspondingly. Eg. `\u0101\u0300\u0300\u0300` shifts bar 3 values down, etc.
* Values below range are limited to 0, eg. _0x0ff_ in _wavefont100_ is mapped to 0.
* Values above range are supported to some extent and then clipped, eg. _0x164_ (dec 101) in _wavefont100_ is supported and value above 108 is clipped.
* Space, tab and other non-marking characters alias to _0_ value.
* Dashes, dot, underscore characters alias to _1_ value.
* Vertical lines like `|` alias to max value.
* Block characters ▁▂▃▄▅▆▇█ are mapped to corresponding bars.


## Building

[UFOs](https://unifiedfontobject.org/versions/ufo3/) are generated by [plop](https://github.com/plopjs/plop), to modify font the [plopfile](./plopfile.js) change is required.
TTF is built with [fontmake](https://github.com/googlefonts/fontmake). OTF is built with [afdko](https://adobe-type-tools.github.io/afdko/).
WOFF is built with [fonttools](https://fonttools.readthedocs.io/en/latest/).

## See also

* [linefont](https://github.com/a-vis/linefont) − font-face for rendering linear data.

## References

* [unified font object spec](https://unifiedfontobject.org/versions/ufo3) − unified human-readable format for storing font data.
* [feature file spec](https://adobe-type-tools.github.io/afdko/OpenTypeFeatureFileSpecification.html#6.h) − defining opentype font features.
* [afdko](https://adobe-type-tools.github.io/afdko/) − font building tools from Adobe.
* [fontmake](https://github.com/googlefonts/fontmake) − font building tool from Google.
* [unicode-table](https://unicode-table.com/) − convenient unicode table.
* [adobe-variable-font-prototype](https://github.com/adobe-fonts/adobe-variable-font-prototype) − example variable font.
* [designspace xml spec](https://github.com/fonttools/fonttools/tree/main/Doc/source/designspaceLib#document-xml-structure) − human-readable format for describing variable fonts.
* [plopfile](https://github.com/plopjs/plop#built-in-actions) − file generator based on templates.
* [Adobe Blank](https://github.com/adobe-fonts/adobe-blank-vf) − blank characters variable font.

<p align="center">🕉<p>
