# wavefont [![build](https://github.com/dy/wavefont/actions/workflows/build.yaml/badge.svg)](https://github.com/dy/wavefont/actions/workflows/build.yaml)

A typeface for rendering vertical bars data: waveforms, spectrums, diagrams, histograms, columns etc.

<img src="./preview.png" width="240px"/>

[**Playground**](https://dy.github.io/wavefont/scripts)&nbsp;&nbsp;•&nbsp;&nbsp;[**Google fonts**](https://fonts.google.com/specimen/Wavefont/tester)&nbsp;&nbsp;•&nbsp;&nbsp;[**V-fonts**](https://v-fonts.com/fonts/wavefont)&nbsp;&nbsp;•&nbsp;&nbsp;
[**Wavearea**](https://audio-lab.github.io/wavearea?src=https://cdn.freesound.org/previews/147/147582_1728127-lq.mp3)

## Usage

Place [_Wavefont[ROND,YELA,wdth,wght].woff2_](./fonts/variable/Wavefont[ROND,YELA,wdth,wght].woff2) into your project directory and use this code:

```html
<style>
@font-face {
	font-family: wavefont;
	font-display: block;
	src: url(./Wavefont[ROND,YELA,wdth,wght].woff2) format('woff2');
}
.wavefont {
	--wght: 10;
	--wdth: 100;
	font-family: wavefont;
	font-variation-settings: 'wght' var(--wght), 'wdth' var(--wdth), 'ROND' 30, 'YELA' 0;
}
</style>

<!-- Set values manually -->
<textarea id="waveform" class="wavefont" cols="100">
abcdefghijklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
</textarea>

<script>
// Set values programmatically (more precise)
waveform.textContent = Array.from({length: 100}, (_,i) => String.fromCharCode(0x100 + i)).join('')
</script>
```

## Ranges

Wavefont bars correspond to values from 0 to 100, assigned to different characters:

* <kbd>0-9</kbd> chars are for simplified manual input with step 10 (bar height = number).
* <kbd>a-zA-Z</kbd> for manual input with step 2, softened at edges <kbd>a</kbd> and <kbd>Z</kbd> (bar height = number of letter).
* <kbd>U+0100-017F</kbd> for 0..127 values with step 1 (`char = String.fromCharCode(0x100 + value)`).

## Variable axes

Tag | Range | Default | Meaning
---|---|---|---
`wght` | _1_-_1000_ | 1 | Bar width, or boldness.
`wdth` | _25_–_200_ | 200 | Distance between bars (absolute).
`ROND` | _0_-_100_ | 100 | Border radius, or roundness (percent).
`YELA` | _-100_-_100_ | -100 | Alignment: bottom, center or top.

To adjust axes via CSS:
```css
.wavefont {
  font-variation-settings: 'wght' var(--wght, 400), 'ROND' var(--rond, 0), 'YELA' var(--align, 0);
  letter-spacing: 1ch; /* 1ch unit === 1 bar width */
}
```

## Features

* Ranges, values, width and weight is compatible with [linefont](https://github.com/dy/linefont), so fonts can be switched in coherent way.
* Visible charcodes fall under _marking characters_ unicode category, ie. recognized as word by regexp and can be selected with <kbd>Ctrl</kbd> + <kbd>→</kbd> or double click. Eg. waveform segments separated by ` ` or `-` are selectable by double click.
* Characters outside of visible ranges are clipped to _0_, eg. ` `, `\t` etc.
* `-–._*` map to _1_ value, `|` maps to max value, `▁▂▃▄▅▆▇█` map to corresponding bars.
* Accent acute <kbd>&nbsp;&#x0301;</kbd> (U+0301) shifts bar 1-step up, circumflex accent <kbd>&nbsp;&#x0302;</kbd> (U+0302) 10-steps up. Eg. `\u0101\u0302\u0302\u0301\u0301\u0301` shifts 23 steps up.
* Accent grave <kbd>&nbsp;&#x0300;</kbd> (U+0300) shifts bar 1-step down, caron <kbd>&nbsp;&#x030c;</kbd> (U+030C) shifts 10 steps down, eg. `\u0101\u030c\u0300\u0300\u0300` shifts 13 steps down.
* Caret span is -20..120, so line-height = 1.4 is minimal non-overlapping selection.
* `wght` can be mapped 1:1 to `wdth` as 300:25, 500:50, 700:100, 900:200.
<!-- * Anti-[FOUT](https://css-tricks.com/fout-foit-foft/): any character out of visible range is mapped to blank (similar to [Adobe Blank](https://github.com/adobe-fonts/adobe-blank-vf)). -->

## JS package

To facilitate calculation, wavefont exposes a function that calculates string from values.

```js
import wf from 'wavefont'

// get characters for values from 0..127 range
wf(0, 1, 50, 99, 127, ...) // ĀāĲţŤ...
```

## Building

`make build`

* [Tests](https://dy.github.io/wavefont/out/fontbakery/fontbakery-report)
* [Glyphs](https://dy.github.io/wavefont/out/proof/glyphs)
* [Text](https://dy.github.io/wavefont/out/proof/text)
* [Waterfall](https://dy.github.io/wavefont/out/proof/waterfall)

## See also

* [linefont](https://github.com/dy/linefont) − font-face for rendering linear data.

## References

* [Google Fonts guide](https://googlefonts.github.io/gf-guide/variable.html#most-common-axes).
* [Unified font object spec](https://unifiedfontobject.org/versions/ufo3) − unified human-readable format for storing font data.
* [Feature file spec](https://adobe-type-tools.github.io/afdko/OpenTypeFeatureFileSpecification.html#6.h) − defining opentype font features.
* [Adobe-variable-font-prototype](https://github.com/adobe-fonts/adobe-variable-font-prototype) − example variable font.
* [Designspace XML spec](https://github.com/fonttools/fonttools/tree/main/Doc/source/designspaceLib#document-xml-structure) − human-readable format for describing variable fonts.
* [Adobe Blank](https://github.com/adobe-fonts/adobe-blank-vf) − blank characters variable font.
<!-- * [Unicode-table](https://unicode-table.com/) − convenient unicode table.-->

<p align="center"><a href="https://github.com/krishnized/license/">🕉</a><p>
