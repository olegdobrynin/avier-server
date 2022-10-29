# Production
setup: install prepare create-db db-migrate

update: pull install db-migrate restart

install:
	npm ci

prepare:
	-cp -n .env.example .env

start:
	pm2 start pm2.config.cjs --env production

stop:
	pm2 stop pm2.config.cjs

restart: stop start

pull:
	git pull

# Development
start-dev:
	npm run dev -s

# DB
create-db:
	npx sequelize db:create

drop-db:
	npx sequelize db:drop

db-migrate:
	npx sequelize db:migrate

undo-last-migration:
	npx sequelize db:migrate:undo

# Utils
lint:
	npx eslint .
