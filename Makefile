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
	@echo '*   `make messages`:	Generate message files for this project'
	@echo '*   `make build`:    Builds translated files for this project'
	@echo ""

messages: force
	@python ./scripts/static_gettext.py --languages "${LANGUAGES}"

build: force
	@echo "Cool. Let's translate this."
	@python ./scripts/static_gettext.py --languages "${LANGUAGES}" --build
	@echo "All done translating. New files are in ./built/"
	@echo ""
	@echo "You might want to consider manual docs update..."
	@echo "cp -R docs built/en_US/"
  

force: ;
