#-----------------------------------------
# Variables
#-----------------------------------------
MKFILE_PATH := $(abspath $(lastword ${MAKEFILE_LIST}))
PROJECT_PATH := $(dir ${MKFILE_PATH})

# command name that are also directories
.PHONY:

#-----------------------------------------
# Allow passing arguments to make
#-----------------------------------------
SUPPORTED_COMMANDS := test.unit
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
  COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(COMMAND_ARGS):;@:)
endif

#-----------------------------------------
# Help commands
#-----------------------------------------
.DEFAULT_GOAL := help

help: ## Prints this help
	@grep -E '^[a-zA-Z_\-\0.0-9]+:.*?## .*$$' ${MAKEFILE_LIST} | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


firebase.deploy: ## Push configuration to firebase
	@docker compose run --rm --workdir "/firebase" firebase-tools firebase deploy

dev: ## Stars dev server
	@docker compose up -d
	@echo "Go to http://127.0.0.1:3000"