include node_modules/make-node/main.mk


SOURCES = com/**/*.js com/**/**/*.js com/**/**/**/*.js
TESTS = test/*.test.js test/**/*.test.js test/**/**/*.test.js test/**/**/**/*.test.js

LCOVFILE = ./reports/coverage/lcov.info

MOCHAFLAGS = --require ./test/bootstrap/node


view-docs:
	open ./docs/index.html

view-cov:
	open ./reports/coverage/lcov-report/index.html

clean: clean-docs clean-cov
	-rm -r $(REPORTSDIR)

clobber: clean
	-rm -r node_modules


apidoc: $(SOURCES)
	jsdoc $(JSDOCFLAGS) -d wwwhtml $^

# npm install swagger-jsdoc --no-save
openapi: $(SOURCES) node_modules/.bin/swagger-jsdoc
	node_modules/.bin/swagger-jsdoc -d etc/openapi.yaml -o openapi.yaml $(SOURCES)
	


.PHONY: clean clobber
