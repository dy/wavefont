
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

template.stamp: _sources/master.ufo _sources/master.ufo/features.fea _sources/master.ufo/fontinfo.plist _sources/Wavefont.designspace node_modules plopfile.js _sources/config.yaml
	npm run build-ufo
	touch template.stamp

build.stamp: venv template.stamp
	. venv/bin/activate; pip3 install -Ur requirements.txt
	npm run normalize-ufo
	gftools builder sources/config.yaml
	npm run build-woff2
	touch build.stamp

venv: venv/touchfile

venv/touchfile: requirements.txt
	test -d venv || python3 -m venv venv
	. venv/bin/activate; pip3 install -Ur requirements.txt
	touch venv/touchfile

test: venv build.stamp
	. venv/bin/activate; mkdir -p out/ out/fontbakery; fontbakery check-googlefonts -l WARN --full-lists --succinct --badges out/badges --html out/fontbakery/fontbakery-report.html --ghmarkdown out/fontbakery/fontbakery-report.md $(shell find fonts/ttf -type f)  || echo '::warning file=sources/config.yaml,title=Fontbakery failures::The fontbakery QA check reported errors in your font. Please check the generated report.'

proof: venv build.stamp
	. venv/bin/activate; mkdir -p out/ out/proof; gftools gen-html proof $(shell find fonts/ttf -type f) -o out/proof

clean:
	rm -rf sources/Wave* template.stamp build.stamp
