run:
	docker-compose build
	docker-compose up -d
	npm run migration:up

run-seed:
	npm run seed:up

kill:
	docker-compose down --volumes

# E2E
run-e2e:
	docker-compose -f docker-compose-test.yml build
	docker-compose -f docker-compose-test.yml up -d
	npm run migration:up:tests

run-e2e-seed:
	npm run seed:up:tests

run-e2e-tests:
	npm run test:e2e

kill-e2e:
	docker-compose -f docker-compose-test.yml down --volumes