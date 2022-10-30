NPM=npm
YARN=yarn
NODE=node

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

