all: install create-db db-migrate

install:
	npm ci

start:
	npm run dev -s

create-db:
	npx sequelize db:create

drop-db:
	npx sequelize db:drop

db-migrate:
	npx sequelize db:migrate

undo-last-migration:
	npx sequelize db:migrate:undo

lint:
	npx eslint .
