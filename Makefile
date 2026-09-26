
help:
	@echo "###"
	@echo "# Build targets for Wavefont"
	@echo "###"
	@echo
	@echo "  make build:  Builds the fonts and places them in the fonts/ directory"
	@echo "  make test:   Tests the fonts with fontbakery"
	@echo

build: node_modules build.stamp

node_modules: package.json
	npm install

template.stamp: _sources/master.ufo _sources/master.ufo/features.fea _sources/master.ufo/fontinfo.plist _sources/Wavefont.designspace node_modules plopfile.cjs _sources/config.yaml
	npm run build-ufo
	touch template.stamp

build.stamp: venv template.stamp
	. venv/bin/activate && npm run normalize-ufo && gftools builder sources/config.yaml && npm run build-pairs && npm run build-woff2
	touch build.stamp

venv: venv/touchfile

venv/touchfile: requirements.txt
	test -x venv/bin/python || python3 -m venv venv
	venv/bin/pip install -Ur requirements.txt
	touch venv/touchfile

# Google Fonts profile on the variable font (the file Google Fonts ships); any FAIL fails.
# Excluded, by design: axis defaults ROND 100 / YELA -100 are not the registry's 0 (Google Fonts
# carries registry_default_overrides); vertical metrics widened in 3.6 (caret span -30..130) differ
# from the older version on Google Fonts until it updates; combining marks shift bars instead of
# attaching to letters, so language shaping cannot pass.
test: venv build.stamp
	. venv/bin/activate && python scripts/test-pairs.py fonts/variable/*.ttf fonts/ttf/*.ttf
	. venv/bin/activate && mkdir -p out/fontbakery && fontbakery check-googlefonts -l WARN --full-lists --succinct -x fvar_axis_defaults -x vertical_metrics_regressions -x shape_languages --badges out/badges --html out/fontbakery/fontbakery-report.html --ghmarkdown out/fontbakery/fontbakery-report.md fonts/variable/*.ttf

proof: venv build.stamp
	. venv/bin/activate; mkdir -p out/ out/proof; diffenator2 proof $(shell find fonts/ttf -type f) -o out/proof

clean:
	rm -rf sources out fonts template.stamp build.stamp venv
