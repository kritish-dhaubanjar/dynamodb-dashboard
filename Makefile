NPM=npm
YARN=yarn
NODE=node
APP=dynamodb-dashboard
# registry
VERDACCIO_REGISTRY=http://localhost:4873
VERDACCIO_STORAGE=~/.local/share/verdaccio/storage/$(APP)

all: install clean
	cd ./app && $(YARN) build-only
	cd ./server && $(YARN) build
	cp -r ./app/dist ./server/build/public

install:
	cd ./app && $(YARN)
	cd ./server && $(YARN)

clean:
	rm -rf ./app/dist
	rm -rf ./server/build

start: all
	$(NODE) ./server/build/bin/cli.js start -o

publish: all
	rm ./server/README.md
	cp ./README.md ./server/README.md
	cd ./server && $(NPM) publish --dry-run

# development
.server:
	cd ./server && $(YARN) dev

.app:
	cd ./app && $(YARN) dev

watch: install
	make -j 2 .server .app

# registry (experimental)
verdaccio: publish
	rm -rf $(VERDACCIO_STORAGE)
	$(NPM) --global uninstall $(APP)
	cd ./server && $(NPM) publish --registry $(VERDACCIO_REGISTRY)
	$(NPM) --global install $(APP) --registry $(VERDACCIO_REGISTRY)
