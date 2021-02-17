# wavefont

A typeface for rendering data: waveforms, spectrums, diagrams, bars etc.

[![wavefont](https://raw.githubusercontent.com/audio-lab/wavefont/gh-pages/preview.png "wavefont")](http://audio-lab.github.io/wavefont/)

Font provides bar glyphs representing values from 0 to 100 (and clipping 28 values) for data.

The data charcodes fall under _Latin Extended-A_ unicode category (U+0100-017F), therefore recognized as word boundary in regexps, can be selected by <kbd>Ctrl</kbd> + <kbd>→</kbd> or _double click_.

Vertical position of a bar can be adjusted via combining accent grave &nbsp;&#x0300; (U+0300) for negative shift or via accent acute &nbsp;&#x0301; (U+0301) for positive shift. One accent character adjusts vertical position by 1. To provide shift by more than 1 - use multiple accents in a row. Note that using accents introduces editing side effect - cutting a fragment with accents shifts baseline outside the fragment. To compensate that, use `oncut`/`onpaste` events.

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
<textarea id="waveform" class="wavefont" cols="100">
	&#x0100;&#x0101;&#x0102;&#x0103;&#x0301;&#x0104;&#x0105; ... &#x017f;
</textarea>

<script>
waveform.addEventListener('cut', e => {
	// ...compensate shift in removed fragment
})
</script>
```

<p align="center">🕉<p>
