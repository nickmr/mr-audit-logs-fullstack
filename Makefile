.PHONY: help start setup install install-root install-server install-client ensure-env migrate seed reset-db server client dev test clean

help:
	@echo "Targets:"
	@echo "  start       Set up (idempotent) and run both servers"
	@echo "  setup       Install deps, run migrations, seed the database"
	@echo "  install     Install deps for client and server"
	@echo "  migrate     Apply Prisma migrations (creates dev.db on first run)"
	@echo "  seed        Seed the database from server/seed-data/audit-logs.json"
	@echo "  reset-db    Drop, re-create, and re-seed the database"
	@echo "  server      Run the backend on http://localhost:3001"
	@echo "  client      Run the frontend on http://localhost:3000"
	@echo "  dev         Run both server and client (Ctrl+C stops both)"
	@echo "  test        Run server and client test suites"
	@echo "  clean       Remove node_modules and the SQLite database"

start: setup dev

setup: install migrate seed

install: install-root install-server install-client

install-root:
	npm install

install-server:
	cd server && npm install

install-client:
	cd client && npm install

ensure-env:
	@test -f server/.env || (cp server/.env.example server/.env && echo "Created server/.env from .env.example")

migrate: ensure-env
	cd server && npx prisma migrate dev --name init

seed: ensure-env
	cd server && npm run db:seed

reset-db: ensure-env
	cd server && npm run db:reset

server:
	cd server && npm run dev

client:
	cd client && npm run start

dev:
	npm run dev

test:
	cd server && npm test

clean:
	rm -rf node_modules server/node_modules client/node_modules
	rm -f server/prisma/dev.db server/prisma/dev.db-journal
