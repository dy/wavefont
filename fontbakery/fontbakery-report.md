## FontBakery report

fontbakery version: 0.11.1

<h2>Check results</h2><details><summary><b>[9] Wavefont-Thin.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-Light.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-Black.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-Regular.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-Bold.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-Medium.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-ExtraLight.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-SemiBold.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[9] Wavefont-ExtraBold.ttf</b></summary><div><details><summary>💔 <b>ERROR:</b> Shapes languages in all GF glyphsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/glyphsets/shape_languages">com.google.fonts/check/glyphsets/shape_languages</a>)</summary><div>


* 💔 **ERROR** Failed with ModuleNotFoundError: No module named 'shaperglot.checker'
```
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/checkrunner.py", line 170, in _exec_check
    results.extend(list(result))
                   ^^^^^^^^^^^^
  File "/home/runner/work/wavefont/wavefont/venv/lib/python3.11/site-packages/fontbakery/profiles/googlefonts.py", line 3532, in com_google_fonts_check_glyphsets_shape_languages
    from shaperglot.checker import Checker

``` [code: failed-check]
</div></details><details><summary>🔥 <b>FAIL:</b> Do we have the latest version of FontBakery installed? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/fontbakery_version">com.google.fonts/check/fontbakery_version</a>)</summary><div>


* 🔥 **FAIL** Current FontBakery version is 0.11.1, while a newer 1.1.0 is already available. Please upgrade it with 'pip install -U fontbakery' [code: outdated-fontbakery]
</div></details><details><summary>🔥 <b>FAIL:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


* 🔥 **FAIL** The following glyphs have no contours even though they were expected to have some:

	- Glyph name: down	Expected: 1

	- Glyph name: up	Expected: 1

	- Glyph name: up10	Expected: 1

	- Glyph name: down10	Expected: 1
 [code: no-contour]
* ⚠ **WARN** This check inspects the glyph outlines and detects the total number of contours in each of them. The expected values are infered from the typical ammounts of contours observed in a large collection of reference font families. The divergences listed below may simply indicate a significantly different design on some of your glyphs. On the other hand, some of these may flag actual bugs in the font such as glyphs mapped to an incorrect codepoint. Please consider reviewing the design and codepoint assignment of these to make sure they are correct.

The following glyphs do not have the recommended number of contours:

	- Glyph name: _2	Contours detected: 1	Expected: 3

	- Glyph name: _3	Contours detected: 1	Expected: 3

	- Glyph name: _4	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _5	Contours detected: 1	Expected: 2

	- Glyph name: _6	Contours detected: 1	Expected: 2

	- Glyph name: _7	Contours detected: 1	Expected: 2

	- Glyph name: _8	Contours detected: 1	Expected: 2

	- Glyph name: _9	Contours detected: 1	Expected: 2

	- Glyph name: _10	Contours detected: 1	Expected: 2

	- Glyph name: _11	Contours detected: 1	Expected: 2

	- Glyph name: _12	Contours detected: 1	Expected: 2

	- Glyph name: _13	Contours detected: 1	Expected: 2

	- Glyph name: _15	Contours detected: 1	Expected: 3

	- Glyph name: _16	Contours detected: 1	Expected: 2

	- Glyph name: _17	Contours detected: 1	Expected: 2

	- Glyph name: _18	Contours detected: 1	Expected: 2

	- Glyph name: _19	Contours detected: 1	Expected: 3

	- Glyph name: _20	Contours detected: 1	Expected: 2

	- Glyph name: _21	Contours detected: 1	Expected: 3

	- Glyph name: _22	Contours detected: 1	Expected: 2

	- Glyph name: _23	Contours detected: 1	Expected: 3

	- Glyph name: _25	Contours detected: 1	Expected: 2

	- Glyph name: _26	Contours detected: 1	Expected: 2

	- Glyph name: _27	Contours detected: 1	Expected: 3

	- Glyph name: _29	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _30	Contours detected: 1	Expected: 2

	- Glyph name: _31	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _32	Contours detected: 1	Expected: 2

	- Glyph name: _33	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _34	Contours detected: 1	Expected: 2

	- Glyph name: _35	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _36	Contours detected: 1	Expected: 2

	- Glyph name: _37	Contours detected: 1	Expected: 2

	- Glyph name: _38	Contours detected: 1	Expected: 2

	- Glyph name: _40	Contours detected: 1	Expected: 2

	- Glyph name: _41	Contours detected: 1	Expected: 2

	- Glyph name: _43	Contours detected: 1	Expected: 2

	- Glyph name: _44	Contours detected: 1	Expected: 2

	- Glyph name: _45	Contours detected: 1	Expected: 2

	- Glyph name: _47	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _48	Contours detected: 1	Expected: 2

	- Glyph name: _51	Contours detected: 1	Expected: 3 or 4

	- Glyph name: _52	Contours detected: 1	Expected: 2

	- Glyph name: _53	Contours detected: 1	Expected: 2

	- Glyph name: _54	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _55	Contours detected: 1	Expected: 2 or 3

	- Glyph name: _57	Contours detected: 1	Expected: 2

	- Glyph name: _58	Contours detected: 1	Expected: 2

	- Glyph name: _59	Contours detected: 1	Expected: 2

	- Glyph name: _60	Contours detected: 1	Expected: 2

	- Glyph name: _61	Contours detected: 1	Expected: 2

	- Glyph name: _62	Contours detected: 1	Expected: 2

	- Glyph name: _63	Contours detected: 1	Expected: 2

	- Glyph name: _64	Contours detected: 1	Expected: 2

	- Glyph name: _67	Contours detected: 1	Expected: 2

	- Glyph name: _68	Contours detected: 1	Expected: 2

	- Glyph name: _69	Contours detected: 1	Expected: 2

	- Glyph name: _70	Contours detected: 1	Expected: 2

	- Glyph name: _71	Contours detected: 1	Expected: 2

	- Glyph name: _73	Contours detected: 1	Expected: 2

	- Glyph name: _76	Contours detected: 1	Expected: 3

	- Glyph name: _77	Contours detected: 1	Expected: 3

	- Glyph name: _78	Contours detected: 1	Expected: 3

	- Glyph name: _79	Contours detected: 1	Expected: 3

	- Glyph name: _80	Contours detected: 1	Expected: 4

	- Glyph name: _81	Contours detected: 1	Expected: 4

	- Glyph name: _82	Contours detected: 1	Expected: 2

	- Glyph name: _83	Contours detected: 1	Expected: 3

	- Glyph name: _84	Contours detected: 1	Expected: 3

	- Glyph name: _85	Contours detected: 1	Expected: 2

	- Glyph name: _87	Contours detected: 1	Expected: 2

	- Glyph name: _88	Contours detected: 1	Expected: 3

	- Glyph name: _89	Contours detected: 1	Expected: 2

	- Glyph name: _90	Contours detected: 1	Expected: 2

	- Glyph name: _91	Contours detected: 1	Expected: 2

	- Glyph name: _92	Contours detected: 1	Expected: 2

	- Glyph name: _93	Contours detected: 1	Expected: 2

	- Glyph name: _96	Contours detected: 1	Expected: 2

	- Glyph name: _97	Contours detected: 1	Expected: 2

	- Glyph name: _101	Contours detected: 1	Expected: 2

	- Glyph name: _104	Contours detected: 1	Expected: 2

	- Glyph name: _105	Contours detected: 1	Expected: 2

	- Glyph name: _106	Contours detected: 1	Expected: 2

	- Glyph name: _107	Contours detected: 1	Expected: 2

	- Glyph name: _108	Contours detected: 1	Expected: 2

	- Glyph name: _109	Contours detected: 1	Expected: 2

	- Glyph name: _110	Contours detected: 1	Expected: 3

	- Glyph name: _111	Contours detected: 1	Expected: 3

	- Glyph name: _112	Contours detected: 1	Expected: 3

	- Glyph name: _113	Contours detected: 1	Expected: 3

	- Glyph name: _116	Contours detected: 1	Expected: 2

	- Glyph name: _117	Contours detected: 1	Expected: 2

	- Glyph name: _118	Contours detected: 1	Expected: 2

	- Glyph name: _119	Contours detected: 1	Expected: 2

	- Glyph name: _120	Contours detected: 1	Expected: 3

	- Glyph name: _121	Contours detected: 1	Expected: 2

	- Glyph name: _122	Contours detected: 1	Expected: 2

	- Glyph name: _123	Contours detected: 1	Expected: 2

	- Glyph name: _124	Contours detected: 1	Expected: 2

	- Glyph name: _125	Contours detected: 1	Expected: 2

	- Glyph name: _126	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Check for codepoints not covered by METADATA subsets. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/metadata/unreachable_subsetting">com.google.fonts/check/metadata/unreachable_subsetting</a>)</summary><div>


* ⚠ **WARN** The following codepoints supported by the font are not covered by
    any subsets defined in the font's metadata file, and will never
    be served. You can solve this by either manually adding additional
    subset declarations to METADATA.pb, or by editing the glyphset
    definitions.

 * U+0009 : try adding symbols
 * U+000A : try adding symbols
 * U+000B : try adding symbols
 * U+000C : try adding symbols
 * U+0085 : try adding symbols
 * U+02CD MODIFIER LETTER LOW MACRON: try adding lisu
 * U+02D8 BREVE: try adding one of: yi, canadian-aboriginal
 * U+02D9 DOT ABOVE: try adding one of: yi, canadian-aboriginal
 * U+02DB OGONEK: try adding one of: yi, canadian-aboriginal
 * U+0302 COMBINING CIRCUMFLEX ACCENT: try adding one of: math, coptic, tifinagh, cherokee
 * U+0306 COMBINING BREVE: try adding one of: tifinagh, old-permic
 * U+0307 COMBINING DOT ABOVE: try adding one of: canadian-aboriginal, malayalam, duployan, syriac, tai-le, todhri, math, coptic, tifinagh, old-permic, hebrew
 * U+030A COMBINING RING ABOVE: try adding one of: duployan, syriac
 * U+030B COMBINING DOUBLE ACUTE ACCENT: try adding one of: osage, cherokee
 * U+030C COMBINING CARON: try adding one of: tai-le, cherokee
 * U+0312 COMBINING TURNED COMMA ABOVE: try adding math
 * U+0326 COMBINING COMMA BELOW: try adding math
 * U+0327 COMBINING CEDILLA: try adding math
 * U+0328 COMBINING OGONEK: not included in any glyphset definition
 * U+1680 OGHAM SPACE MARK: try adding ogham
 * U+180E MONGOLIAN VOWEL SEPARATOR: try adding mongolian
 * U+2000 EN QUAD: try adding symbols2
 * U+2001 EM QUAD: try adding symbols2
 * U+2003 EM SPACE: try adding nushu
 * U+2004 THREE-PER-EM SPACE: try adding symbols2
 * U+2005 FOUR-PER-EM SPACE: try adding symbols2
 * U+2006 SIX-PER-EM SPACE: try adding symbols2
 * U+2007 FIGURE SPACE: try adding symbols2
 * U+2008 PUNCTUATION SPACE: try adding symbols2
 * U+200A HAIR SPACE: try adding symbols2
 * U+200C ZERO WIDTH NON-JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, thai, hatran, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+200D ZERO WIDTH JOINER: try adding one of: gunjala-gondi, takri, kaithi, lepcha, syriac, kharoshthi, warang-citi, khojki, limbu, avestan, rejang, balinese, syloti-nagri, mahajani, grantha, bhaiksuki, buhid, malayalam, myanmar, siddham, tai-tham, meetei-mayek, gujarati, khudawadi, duployan, brahmi, hanunoo, tagalog, telugu, psalter-pahlavi, pahawh-hmong, mongolian, hanifi-rohingya, mandaic, tai-viet, arabic, old-hungarian, thai, buginese, khmer, kayah-li, newa, bengali, sinhala, sharada, sogdian, sundanese, javanese, lao, hebrew, manichaean, nko, tifinagh, oriya, thaana, kannada, tibetan, tirhuta, saurashtra, tamil, new-tai-lue, cham, dogra, gurmukhi, modi, masaram-gondi, tai-le, zanabazar-square, phags-pa, yi, devanagari, tagbanwa, chakma, batak
 * U+2015 HORIZONTAL BAR: try adding adlam
 * U+2028 LINE SEPARATOR: not included in any glyphset definition
 * U+2029 PARAGRAPH SEPARATOR: not included in any glyphset definition
 * U+202F NARROW NO-BREAK SPACE: try adding one of: yi, phags-pa, mongolian
 * U+205F MEDIUM MATHEMATICAL SPACE: try adding math
 * U+2060 WORD JOINER: not included in any glyphset definition
 * U+2061 FUNCTION APPLICATION: not included in any glyphset definition
 * U+2062 INVISIBLE TIMES: not included in any glyphset definition
 * U+2581 LOWER ONE EIGHTH BLOCK: try adding symbols2
 * U+2582 LOWER ONE QUARTER BLOCK: try adding symbols2
 * U+2583 LOWER THREE EIGHTHS BLOCK: try adding symbols2
 * U+2584 LOWER HALF BLOCK: try adding symbols2
 * U+2585 LOWER FIVE EIGHTHS BLOCK: try adding symbols2
 * U+2586 LOWER THREE QUARTERS BLOCK: try adding symbols2
 * U+2587 LOWER SEVEN EIGHTHS BLOCK: try adding symbols2
 * U+2588 FULL BLOCK: try adding symbols2
 * U+3000 IDEOGRAPHIC SPACE: try adding one of: chinese-traditional, chinese-simplified, chinese-hongkong, phags-pa, yi, nushu, japanese

Or you can add the above codepoints to one of the subsets supported by the font: `latin`, `latin-ext` [code: unreachable-subsetting]
</div></details><details><summary>⚠ <b>WARN:</b> Check copyright namerecords match license file. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/license">com.google.fonts/check/name/license</a>)</summary><div>


* ⚠ **WARN** Please consider updating the url from 'https://scripts.sil.org/OFL' to 'https://openfontlicense.org'. [code: old-url]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _0.clip

	- _1.clip

	- _10.clip

	- _11.clip

	- _12.clip

	- _13.clip

	- _14.clip

	- _15.clip

	- _16.clip

	- _17.clip

	- _18.clip

	- _19.clip

	- _2.clip

	- _20.clip

	- _21.clip

	- _22.clip

	- _23.clip

	- _24.clip

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check accent of Lcaron, dcaron, lcaron, tcaron (derived from com.google.fonts/check/alt_caron) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/alt_caron">com.google.fonts/check/alt_caron</a>)</summary><div>


* ⚠ **WARN** _15 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _61 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _62 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
* ⚠ **WARN** _101 is decomposed and therefore could not be checked. Please check manually. [code: decomposed-outline]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details>

### Summary

| 💔 ERROR | ☠ FATAL | 🔥 FAIL | ⚠ WARN | 💤 SKIP | ℹ INFO | 🍞 PASS | 🔎 DEBUG |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| 9 | 0 | 18 | 54 | 1181 | 55 | 871 | 0 |
| 0% | 0% | 1% | 2% | 54% | 3% | 40% | 0% |

**Note:** The following loglevels were omitted in this report:
* **SKIP**
* **INFO**
* **PASS**
* **DEBUG**
