#############################################################################
#
#	SDE Static Assets Makefile
#

PYTHON ?= python

.PHONY = info messages build force

info:
	@echo "Usage:"
	@echo ""
	@echo '*   `make messages`:	Generate message files for this project'
	@echo '*   `make build`:    Builds translated files for this project'
	@echo ""

messages: force
	@python ./scripts/static_gettext.py --languages en_US,de_DE

build: force
	@python ./scripts/static_gettext.py --languages en_US,de_DE --compile && python ./scripts/static_gettext.py --languages en_US,de_DE --render

force: ;
