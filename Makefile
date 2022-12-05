build: node_modules build_font

node_modules: package.json
	npm install

sources/template.stamp: _source/master.ufo _source/wavefont.designspace node_modules
	npm run build-ufo
	touch sources/template.stamp

build_font: sources/template.stamp sources/wavefont.designspace sources/config.yaml venv
	. venv/bin/activate ; gftools builder sources/config.yaml

venv: venv/touchfile

venv/touchfile: requirements.txt
	test -d venv || python3 -m venv venv
	. venv/bin/activate; pip install -Ur requirements.txt
	touch venv/touchfile
