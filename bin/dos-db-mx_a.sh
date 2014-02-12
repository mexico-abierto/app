#! /bin/sh

NODE_PATH=. node ./bin/dos-db load tag ./lib/fixtures/tags-mexico-abierto.json
NODE_PATH=. node ./bin/dos-db load law ./lib/fixtures/laws-mexico-abierto.json

