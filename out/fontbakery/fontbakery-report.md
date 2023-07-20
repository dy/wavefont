## Fontbakery report

Fontbakery version: 0.8.13

<details><summary><b>[7] Wavefont-ExtraBold.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Medium.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _121 (U+0179): X=11.5,Y=1199.5 (should be at ascender 1200?) 

	* _121 (U+0179): X=64.0,Y=1199.0 (should be at ascender 1200?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Black.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _123 (U+017B): X=29.0,Y=1200.5 (should be at ascender 1200?) 

	* _123 (U+017B): X=170.5,Y=1200.5 (should be at ascender 1200?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[7] Wavefont-Light.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Bold.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _122 (U+017A): X=18.5,Y=1201.5 (should be at ascender 1200?) 

	* _122 (U+017A): X=109.0,Y=1201.0 (should be at ascender 1200?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Thin.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _120 (U+0178): X=0.0,Y=1198.0 (should be at ascender 1200?)

	* _120 (U+0178): X=0.0,Y=1198.0 (should be at ascender 1200?)

	* _120 (U+0178): X=5.0,Y=1198.0 (should be at ascender 1200?) 

	* _120 (U+0178): X=5.0,Y=1198.0 (should be at ascender 1200?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Regular.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _121 (U+0179): X=46.0,Y=1202.0 (should be at ascender 1200?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[8] Wavefont-ExtraLight.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _121 (U+0179): X=0.0,Y=1202.0 (should be at ascender 1200?)

	* _121 (U+0179): X=0.0,Y=1202.0 (should be at ascender 1200?)

	* _121 (U+0179): X=16.0,Y=1202.0 (should be at ascender 1200?) 

	* _121 (U+0179): X=16.0,Y=1202.0 (should be at ascender 1200?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[7] Wavefont-SemiBold.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWinAscent & usWinDescent. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/family/win_ascent_and_descent">com.google.fonts/check/family/win_ascent_and_descent</a>)</summary><div>


* 🔥 **FAIL** OS/2.usWinAscent value should be equal or greater than 1270, but got 1200 instead [code: ascent]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available. To fix this, invoke the 'freetype' extra when installing Font Bakery:
pip3 install -U fontbakery[freetype] [code: freetype-not-installed]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
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

	- _3.clip

	- _4.clip

	- _5.clip

	- _6.clip

	- _7.clip

	- _8.clip

	- _9.clip 

	- cap
 [code: unreachable-glyphs]
</div></details><details><summary>⚠ <b>WARN:</b> Check if each glyph has the recommended amount of contours. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/contour_count">com.google.fonts/check/contour_count</a>)</summary><div>


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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1 

	- Glyph name: down10	Contours detected: 0	Expected: 1
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* ⚠ **WARN** The OpenType spec recomments at https://learn.microsoft.com/en-us/typography/opentype/spec/recom#hhea-table that hhea.numberOfHMetrics be set to 3 but this font has 7 instead.
Please read https://github.com/fonttools/fonttools/issues/3014 to decide whether this makes sense for your font. [code: bad-numberOfHMetrics]
</div></details><br></div></details>

### Summary

| 💔 ERROR | 🔥 FAIL | ⚠ WARN | 💤 SKIP | ℹ INFO | 🍞 PASS | 🔎 DEBUG |
|:-----:|:----:|:----:|:----:|:----:|:----:|:----:|
| 0 | 18 | 51 | 1118 | 55 | 836 | 0 |
| 0% | 1% | 2% | 54% | 3% | 40% | 0% |

**Note:** The following loglevels were omitted in this report:
* **SKIP**
* **INFO**
* **PASS**
* **DEBUG**
