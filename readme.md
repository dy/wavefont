# wavefont

A typeface for rendering data: waveforms, spectrums, diagrams, bars etc.

[![wavefont](https://raw.githubusercontent.com/a-vis/wavefont/gh-pages/preview.png "wavefont")](http://a-vis.github.io/wavefont/)

Font provides bar glyphs representing values from 0 to 100 (and clipping 28 values) for data.

The data charcodes fall under _Latin Extended-A_ unicode category (U+0100-017F), therefore recognized as word boundary in regexps, can be selected by <kbd>Ctrl</kbd> + <kbd>→</kbd> or double click.

Vertical position of a bar can be adjusted via combining accent grave <kbd>&nbsp;&#x0300;</kbd> (U+0300) for negative shift or via accent acute <kbd>&nbsp;&#x0301;</kbd> (U+0301) for positive shift. One accent character adjusts vertical position by _1_. To provide shift by more than 1 - use multiple accents in a row. Note that using accents introduces editing side effect - cutting a fragment with accents shifts baseline outside the fragment. To compensate that, use `oncut`/`onpaste` events.

Font also provides variables: _width_ and _align_ variable features that can be adjusted via `font-variation-settings` as `'wdth'` tag ranging from _1_ to _100_ and `'algn'` taking _0_ for bottom align, _0.5_ for center align and _1_ for top align.

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
		--wdth: 10;
		font-variation-settings: 'wdth' var(--wdth), 'algn' 0.5;
	}
</style>

<!-- direct values -->
<textarea id="waveform" class="wavefont" cols="100">
	&#x0100;&#x0101;&#x0102;&#x0103;&#x0301;&#x0104;&#x0105; ... &#x017f;
</textarea>

<script>
waveform.addEventListener('cut', e => {
	// ...compensate shift in removed fragment
})
</script>
```

## Credits

* [unified font object spec](https://unifiedfontobject.org/versions/ufo3) − unified human-readable format for storing font data.
* [feature file spec](https://adobe-type-tools.github.io/afdko/OpenTypeFeatureFileSpecification.html#6.h) − defining opentype font features.
* [afdko](https://adobe-type-tools.github.io/afdko/) − font building tools from Adobe.
* [fontmake](0)
* [unicode-table](https://unicode-table.com/) − convenient unicode table.
* [adobe-variable-font-prototype](https://github.com/adobe-fonts/adobe-variable-font-prototype) − example variable font.
* [designspace xml spec](https://github.com/LettError/designSpaceDocument#document-xml-structure) − human-readable format for describing variable fonts.
* [designspace overview](https://robofont.com/documentation/how-tos/creating-designspace-files/) − overview of tools for designspace files.

<p align="center">🕉<p>
