#############################################################################
#
#	SDE Static Assets Makefile
#

PYTHON ?= python

.PHONY = info messages build force

LANGUAGES="cn_PRC,da_DK,de_DE,en_US,es,fr_FR,he,it,ja,nl,pt_BR,ro_RO,ru,sr"

info:
	@echo "Usage:"
	@echo ""
	@echo '*   `make messages`: Generate message files for this project'
	@echo '*   `make docs`:     Builds docs files for this project'
	@echo '*   `make build`:    Builds translated files for this project'
	@echo ""

messages: force
	@echo "Cool. Let's start..."
	@python ./scripts/static_gettext.py --languages "${LANGUAGES}"
	@echo "All done. New message files are in ./locale/"

docs: force
	@echo "Cool. First I'm gonna update the wiki files"
	git submodule update --init
	cd docs/wiki-upstream && git pull origin master && cd ../..
	@echo "Let's build the docs..."
	node ../h5bp-docs/bin/h5bp-cli.js --config docs-config.js 
	@echo ""
	@echo "All done. New docs files are in ./src/docs/"

build: force
	@echo "Cool. Let's translate this."
	@python ./scripts/static_gettext.py --languages "${LANGUAGES}" --build
	@echo "All done translating. New files are in ./built/"
	@echo ""
force: ;
