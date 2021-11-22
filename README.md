# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Required Technologies
# Enviroment Setup:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to Completion 

# SQL SHELL (PSQL):
- PostgreSQL configuration steps:
1. Create a user in order to administrate the DB. "CREATE USER store_admin WITH PASSWORD 'dimasha12';"
2. Create a blank database. "CREATE DATABASE store_front;" 
3. Connect to the newly created database. "\c store_front"
4. Grant all privileges to the admin user on the database. "GRANT ALL PRIVILAGES ON DATABASE store_front TO store_admin;"
5. Create a second database for testing purposes. "CREATE DATABASE store_front_test;"
6. Connect the admin to the test database. "\c store_front_test"
7. Grant all privileges to the admin user on the test database. "GRANT ALL PRIVILAGES ON DATABASE store_front_test TO store_admin;"


# NODEJS COMMAND PROMPT:
- NPM dependencies/packages installation: "npm install / yarn add"

- Running the server: "npm start / yarn start"

- Unit testing (Jasmine Spec Testing): "npm test / yarn test"

## PORTS:
-PSQL Database Port: 5432

-Server: 3000

## ENV VALUES:
- POSTGRES_HOST=127.0.0.1
- POSTGRES_USER=store_admin
- POSTGRES_DB=store_front
- POSTGRES_DB_TEST = store_front_test
- POSTGRES_PASSWORD=dimasha12
- ENV=test
- SALT=10
- SECRET_PASSWORD=thisisdima
- TOKEN_SECRET=heythere


