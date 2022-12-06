## Fontbakery report

Fontbakery version: 0.8.10

<details><summary><b>[10] Wavefont-ThinRound.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Check font names are correct (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/font_names">com.google.fonts/check/font_names</a>)</summary><div>


* 🔥 **FAIL** Font names are incorrect:

| nameID | current | expected |
| :--- | :--- | :--- |
| Family Name | Wavefont ThinRound | Wavefont ThinRound |
| Subfamily Name | Regular | Regular |
| Full Name | Wavefont ThinRound | Wavefont ThinRound Regular |
| Poscript Name | Wavefont-ThinRound | WavefontThinRound-Regular |
| Typographic Family Name | Wavefont | N/A |
| Typographic Subfamily Name | ThinRound | N/A | [code: bad-names]
* ⚠ **WARN** Regular missing from full name [code: lacks-regular]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _103.center (U+0467): X=15.5,Y=1000.5 (should be at ascender 1000?)

	* _103.center (U+0467): X=85.5,Y=1000.5 (should be at ascender 1000?)

	* _103.center (U+0467): X=84.5,Y=-0.5 (should be at baseline 0?)

	* _103.center (U+0467): X=84.5,Y=-0.5 (should be at cap-height 0?)

	* _103.center (U+0467): X=84.5,Y=-0.5 (should be at descender 0?)

	* _103.center (U+0467): X=14.5,Y=-0.5 (should be at baseline 0?)

	* _103.center (U+0467): X=14.5,Y=-0.5 (should be at cap-height 0?) 

	* And _103.center (U+0467): X=14.5,Y=-0.5 (should be at descender 0?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Light.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><br></div></details><details><summary><b>[10] Wavefont-UltraLight.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWeightClass. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/usweightclass">com.google.fonts/check/usweightclass</a>)</summary><div>


* 🔥 **FAIL** OS/2 usWeightClass is '200' when it should be '300'. [code: bad-value]
</div></details><details><summary>🔥 <b>FAIL:</b> Check font names are correct (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/font_names">com.google.fonts/check/font_names</a>)</summary><div>


* 🔥 **FAIL** Font names are incorrect:

| nameID | current | expected |
| :--- | :--- | :--- |
| Family Name | Wavefont UltraLight | Wavefont UltraLight |
| Subfamily Name | Regular | Regular |
| Full Name | Wavefont UltraLight | Wavefont UltraLight Regular |
| Poscript Name | Wavefont-UltraLight | WavefontUltraLight-Regular |
| Typographic Family Name | Wavefont | N/A |
| Typographic Subfamily Name | UltraLight | N/A | [code: bad-names]
* ⚠ **WARN** Regular missing from full name [code: lacks-regular]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><br></div></details><details><summary><b>[12] Wavefont-UltraLightRound.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 usWeightClass. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/usweightclass">com.google.fonts/check/usweightclass</a>)</summary><div>


* 🔥 **FAIL** OS/2 usWeightClass is '200' when it should be '300'. [code: bad-value]
</div></details><details><summary>🔥 <b>FAIL:</b> Check font names are correct (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/font_names">com.google.fonts/check/font_names</a>)</summary><div>


* 🔥 **FAIL** Font names are incorrect:

| nameID | current | expected |
| :--- | :--- | :--- |
| Family Name | Wavefont UltraLightRound | Wavefont UltraLightRound |
| Subfamily Name | Regular | Regular |
| Full Name | Wavefont UltraLightRound | Wavefont UltraLightRound Regular |
| Poscript Name | Wavefont-UltraLightRound | WavefontUltraLightRound-Regular |
| Typographic Family Name | Wavefont | N/A |
| Typographic Subfamily Name | UltraLightRound | N/A | [code: bad-names]
* ⚠ **WARN** Regular missing from full name [code: lacks-regular]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Combined length of family and style must not exceed 27 characters. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/family_and_style_max_length">com.google.fonts/check/name/family_and_style_max_length</a>)</summary><div>


* ⚠ **WARN** The combined length of family and style exceeds 27 chars in the following 'WINDOWS' entries:
 FONT_FAMILY_NAME = 'Wavefont UltraLightRound' / SUBFAMILY_NAME = 'Regular'

Please take a look at the conversation at https://github.com/googlefonts/fontbakery/issues/2179 in order to understand the reasoning behind these name table records max-length criteria. [code: too-long]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _103 (U+0167): X=29.5,Y=1001.0 (should be at ascender 1000?)

	* _103 (U+0167): X=170.5,Y=1000.5 (should be at ascender 1000?)

	* _106.center (U+046A): X=29.5,Y=1001.0 (should be at ascender 1000?)

	* _106.center (U+046A): X=170.5,Y=1000.5 (should be at ascender 1000?)

	* _106.center (U+046A): X=170.5,Y=-1.0 (should be at baseline 0?)

	* _106.center (U+046A): X=170.5,Y=-1.0 (should be at cap-height 0?)

	* _106.center (U+046A): X=170.5,Y=-1.0 (should be at descender 0?)

	* _106.center (U+046A): X=29.5,Y=-0.5 (should be at baseline 0?)

	* _106.center (U+046A): X=29.5,Y=-0.5 (should be at cap-height 0?) 

	* And _106.center (U+046A): X=29.5,Y=-0.5 (should be at descender 0?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Thin.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><br></div></details><details><summary><b>[8] Wavefont-Regular.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><br></div></details><details><summary><b>[10] Wavefont-LightRound.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Check font names are correct (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/font_names">com.google.fonts/check/font_names</a>)</summary><div>


* 🔥 **FAIL** Font names are incorrect:

| nameID | current | expected |
| :--- | :--- | :--- |
| Family Name | Wavefont LightRound | Wavefont LightRound |
| Subfamily Name | Regular | Regular |
| Full Name | Wavefont LightRound | Wavefont LightRound Regular |
| Poscript Name | Wavefont-LightRound | WavefontLightRound-Regular |
| Typographic Family Name | Wavefont | N/A |
| Typographic Subfamily Name | LightRound | N/A | [code: bad-names]
* ⚠ **WARN** Regular missing from full name [code: lacks-regular]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _102 (U+0166): X=225.0,Y=999.5 (should be at ascender 1000?)

	* _104.center (U+0468): X=225.0,Y=999.5 (should be at ascender 1000?)

	* _104.center (U+0468): X=75.0,Y=0.5 (should be at baseline 0?)

	* _104.center (U+0468): X=75.0,Y=0.5 (should be at cap-height 0?) 

	* And _104.center (U+0468): X=75.0,Y=0.5 (should be at descender 0?) [code: found-misalignments]
</div></details><br></div></details><details><summary><b>[11] Wavefont-RegularRound.ttf</b></summary><div><details><summary>🔥 <b>FAIL:</b> Check font names are correct (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/font_names">com.google.fonts/check/font_names</a>)</summary><div>


* 🔥 **FAIL** Font names are incorrect:

| nameID | current | expected |
| :--- | :--- | :--- |
| Family Name | Wavefont RegularRound | Wavefont RegularRound |
| Subfamily Name | Regular | Regular |
| Full Name | Wavefont RegularRound | Wavefont RegularRound Regular |
| Poscript Name | Wavefont-RegularRound | WavefontRegularRound-Regular |
| Typographic Family Name | Wavefont | N/A |
| Typographic Subfamily Name | RegularRound | N/A | [code: bad-names]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking OS/2 Metrics match hhea Metrics. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/os2_metrics_match_hhea">com.google.fonts/check/os2_metrics_match_hhea</a>)</summary><div>


* 🔥 **FAIL** OS/2 sTypoAscender (1000) and hhea ascent (1200) must be equal. [code: ascender]
</div></details><details><summary>🔥 <b>FAIL:</b> Ensure that the font can be rasterized by FreeType. (derived from com.adobe.fonts/check/freetype_rasterizer) (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.adobe.fonts/check/freetype_rasterizer">com.adobe.fonts/check/freetype_rasterizer</a>)</summary><div>


* 🔥 **FAIL** FreeType is not available; to install it, invoke the 'freetype' extra when installing Font Bakery. [code: freetype-not-installed]
</div></details><details><summary>🔥 <b>FAIL:</b> Checking correctness of monospaced metadata. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/name.html#com.google.fonts/check/monospace">com.google.fonts/check/monospace</a>)</summary><div>


* 🔥 **FAIL** The PANOSE numbers are incorrect for a monospaced font. Note: Family Type is set to 0, which does not seem right. [code: mono-bad-panose]
</div></details><details><summary>⚠ <b>WARN:</b> Checking OS/2 achVendID. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/vendor_id">com.google.fonts/check/vendor_id</a>)</summary><div>


* ⚠ **WARN** OS/2 VendorID value 'DY  ' is not yet recognized. If you registered it recently, then it's safe to ignore this warning message. Otherwise, you should set it to your own unique 4 character code, and register it with Microsoft at https://www.microsoft.com/typography/links/vendorlist.aspx
 [code: unknown]
</div></details><details><summary>⚠ <b>WARN:</b> Combined length of family and style must not exceed 27 characters. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/name/family_and_style_max_length">com.google.fonts/check/name/family_and_style_max_length</a>)</summary><div>


* ⚠ **WARN** The combined length of family and style exceeds 27 chars in the following 'WINDOWS' entries:
 FONT_FAMILY_NAME = 'Wavefont RegularRound' / SUBFAMILY_NAME = 'Regular'

Please take a look at the conversation at https://github.com/googlefonts/fontbakery/issues/2179 in order to understand the reasoning behind these name table records max-length criteria. [code: too-long]
</div></details><details><summary>⚠ <b>WARN:</b> Ensure fonts have ScriptLangTags declared on the 'meta' table. (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/googlefonts.html#com.google.fonts/check/meta/script_lang_tags">com.google.fonts/check/meta/script_lang_tags</a>)</summary><div>


* ⚠ **WARN** This font file does not have a 'meta' table. [code: lacks-meta-table]
</div></details><details><summary>⚠ <b>WARN:</b> Font contains '.notdef' as its first glyph? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/mandatory_glyphs">com.google.fonts/check/mandatory_glyphs</a>)</summary><div>


* ⚠ **WARN** Glyph '.notdef' should contain a drawing, but it is empty. [code: empty]
</div></details><details><summary>⚠ <b>WARN:</b> Check font contains no unreachable glyphs (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/universal.html#com.google.fonts/check/unreachable_glyphs">com.google.fonts/check/unreachable_glyphs</a>)</summary><div>


* ⚠ **WARN** The following glyphs could not be reached by codepoint or substitution rules:

	- _1.clip

	- _1.clip.center

	- _10.clip

	- _10.clip.center

	- _11.clip

	- _11.clip.center

	- _12.clip

	- _12.clip.center

	- _13.clip

	- _13.clip.center

	- _14.clip

	- _14.clip.center

	- _15.clip

	- _15.clip.center

	- _16.clip

	- _16.clip.center

	- _17.clip

	- _17.clip.center

	- _18.clip

	- _18.clip.center

	- _19.clip

	- _19.clip.center

	- _2.clip

	- _2.clip.center

	- _20.clip

	- _20.clip.center

	- _21.clip

	- _21.clip.center

	- _22.clip

	- _22.clip.center

	- _23.clip

	- _23.clip.center

	- _24.clip

	- _24.clip.center

	- _25.clip

	- _25.clip.center

	- _26.clip

	- _26.clip.center

	- _27.clip

	- _27.clip.center

	- _28.clip

	- _28.clip.center

	- _29.clip

	- _29.clip.center

	- _3.clip

	- _3.clip.center

	- _30.clip

	- _30.clip.center

	- _31.clip

	- _31.clip.center

	- _32.clip

	- _32.clip.center

	- _33.clip

	- _33.clip.center

	- _34.clip

	- _34.clip.center

	- _35.clip

	- _35.clip.center

	- _36.clip

	- _36.clip.center

	- _37.clip

	- _37.clip.center

	- _38.clip

	- _38.clip.center

	- _39.clip

	- _39.clip.center

	- _4.clip

	- _4.clip.center

	- _5.clip

	- _5.clip.center

	- _6.clip

	- _6.clip.center

	- _7.clip

	- _7.clip.center

	- _8.clip

	- _8.clip.center

	- _9.clip

	- _9.clip.center 

	- And cap
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

	- Glyph name: down	Contours detected: 0	Expected: 1

	- Glyph name: up	Contours detected: 0	Expected: 1

	- Glyph name: up10	Contours detected: 0	Expected: 1

	- Glyph name: _0.center	Contours detected: 0	Expected: 2

	- Glyph name: _1.center	Contours detected: 1	Expected: 3

	- Glyph name: _3.center	Contours detected: 1	Expected: 2

	- Glyph name: _7.center	Contours detected: 1	Expected: 3

	- Glyph name: _9.center	Contours detected: 1	Expected: 2

	- Glyph name: _10.center	Contours detected: 1	Expected: 2

	- Glyph name: _12.center	Contours detected: 1	Expected: 2

	- Glyph name: _13.center	Contours detected: 1	Expected: 2

	- Glyph name: _14.center	Contours detected: 1	Expected: 2

	- Glyph name: _16.center	Contours detected: 1	Expected: 2

	- Glyph name: _17.center	Contours detected: 1	Expected: 2

	- Glyph name: _18.center	Contours detected: 1	Expected: 3

	- Glyph name: _20.center	Contours detected: 1	Expected: 2

	- Glyph name: _25.center	Contours detected: 1	Expected: 2

	- Glyph name: _30.center	Contours detected: 1	Expected: 2

	- Glyph name: _36.center	Contours detected: 1	Expected: 3

	- Glyph name: _42.center	Contours detected: 1	Expected: 2

	- Glyph name: _43.center	Contours detected: 1	Expected: 3

	- Glyph name: _44.center	Contours detected: 1	Expected: 2

	- Glyph name: _46.center	Contours detected: 1	Expected: 2

	- Glyph name: _47.center	Contours detected: 1	Expected: 2

	- Glyph name: _48.center	Contours detected: 1	Expected: 2

	- Glyph name: _49.center	Contours detected: 1	Expected: 2

	- Glyph name: _50.center	Contours detected: 1	Expected: 3

	- Glyph name: _52.center	Contours detected: 1	Expected: 2

	- Glyph name: _53.center	Contours detected: 1	Expected: 2

	- Glyph name: _57.center	Contours detected: 1	Expected: 2

	- Glyph name: _62.center	Contours detected: 1	Expected: 2

	- Glyph name: _64.center	Contours detected: 1	Expected: 2

	- Glyph name: _68.center	Contours detected: 1	Expected: 3

	- Glyph name: _74.center	Contours detected: 1	Expected: 2

	- Glyph name: _75.center	Contours detected: 1	Expected: 3

	- Glyph name: _76.center	Contours detected: 1	Expected: 2

	- Glyph name: _78.center	Contours detected: 1	Expected: 2

	- Glyph name: _79.center	Contours detected: 1	Expected: 2

	- Glyph name: _80.center	Contours detected: 1	Expected: 3

	- Glyph name: _81.center	Contours detected: 1	Expected: 4

	- Glyph name: _83.center	Contours detected: 1	Expected: 2

	- Glyph name: _86.center	Contours detected: 1	Expected: 2

	- Glyph name: _87.center	Contours detected: 1	Expected: 3

	- Glyph name: _88.center	Contours detected: 1	Expected: 2

	- Glyph name: _89.center	Contours detected: 1	Expected: 2

	- Glyph name: _90.center	Contours detected: 1	Expected: 2

	- Glyph name: _92.center	Contours detected: 1	Expected: 2

	- Glyph name: _93.center	Contours detected: 1	Expected: 2

	- Glyph name: _94.center	Contours detected: 1	Expected: 2

	- Glyph name: _98.center	Contours detected: 1	Expected: 2

	- Glyph name: _99.center	Contours detected: 1	Expected: 2

	- Glyph name: _102.center	Contours detected: 1	Expected: 2

	- Glyph name: _103.center	Contours detected: 1	Expected: 2

	- Glyph name: _104.center	Contours detected: 1	Expected: 2

	- Glyph name: _105.center	Contours detected: 1	Expected: 2

	- Glyph name: _106.center	Contours detected: 1	Expected: 2 

	- And Glyph name: _107.center	Contours detected: 1	Expected: 2
 [code: contour-count]
</div></details><details><summary>⚠ <b>WARN:</b> Are there any misaligned on-curve points? (<a href="https://font-bakery.readthedocs.io/en/stable/fontbakery/profiles/<Section: Outline Correctness Checks>.html#com.google.fonts/check/outline_alignment_miss">com.google.fonts/check/outline_alignment_miss</a>)</summary><div>


* ⚠ **WARN** The following glyphs have on-curve points which have potentially incorrect y coordinates:

	* _105.center (U+0469): X=99.5,Y=2.0 (should be at baseline 0?)

	* _105.center (U+0469): X=99.5,Y=2.0 (should be at cap-height 0?)

	* _105.center (U+0469): X=99.5,Y=2.0 (should be at descender 0?)

	* _105.center (U+0469): X=99.5,Y=998.0 (should be at ascender 1000?)

	* _105.center (U+0469): X=300.5,Y=998.0 (should be at ascender 1000?)

	* _105.center (U+0469): X=300.5,Y=2.0 (should be at baseline 0?)

	* _105.center (U+0469): X=300.5,Y=2.0 (should be at cap-height 0?) 

	* And _105.center (U+0469): X=300.5,Y=2.0 (should be at descender 0?) [code: found-misalignments]
</div></details><br></div></details>
### Summary

| 💔 ERROR | 🔥 FAIL | ⚠ WARN | 💤 SKIP | ℹ INFO | 🍞 PASS | 🔎 DEBUG |
|:-----:|:----:|:----:|:----:|:----:|:----:|:----:|
| 0 | 31 | 46 | 942 | 49 | 643 | 0 |
| 0% | 2% | 3% | 55% | 3% | 38% | 0% |

**Note:** The following loglevels were omitted in this report:
* **SKIP**
* **INFO**
* **PASS**
* **DEBUG**
