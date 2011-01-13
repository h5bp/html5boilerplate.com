#############################################################################
#
#	SDE Static Assets Makefile
#

PYTHON ?= python

.PHONY = info messages build force

LANGUAGES="en_US,de_DE,it,pt_BR,fr_FR,nl,he,sr,ru"

info:
	@echo "Usage:"
	@echo ""
	@echo '*   `make messages`:	Generate message files for this project'
	@echo '*   `make build`:    Builds translated files for this project'
	@echo ""

messages: force
	@python ./scripts/static_gettext.py --languages "${LANGUAGES}"

build: force
	@python ./scripts/static_gettext.py --languages "${LANGUAGES}" --build

force: ;
