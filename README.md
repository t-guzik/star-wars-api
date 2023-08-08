# Star Wars API

This repository contains a backend REST API for managing "Star Wars" characters and their episodes.

The API is based on the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
Project structure and design are inspired by [domain-driven-hexagon repository](https://github.com/Sairyss/domain-driven-hexagon).

## Table of Contents

- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Running the application locally (docker-compose)](#running-the-application-locally-docker-compose)
- [Running End-to-End Tests](#running-end-to-end-tests)
- [Running the application locally (npm)](#running-the-application-locally-npm)

## Getting Started

To set up and run the application locally, follow these steps:

1. Clone this repository to your local machine.
2. Install Docker and docker-compose if not already installed.
3. Ensure you have Node.js 18 installed. If not, you can use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage multiple Node.js versions.
4. Navigate to the project directory.

## API Documentation

The API is documented using OpenAPI/Swagger. You can access the [API documentation](http://localhost:3000/docs) by visiting the following URL after running the
application:

```bash
http://localhost:3000/docs
```

## Technologies Used

- **[NestJS](https://github.com/nestjs/nest)**
- **TypeScript**
- **PostgreSQL**
- **[slonik](https://github.com/gajus/slonik)**: PostgreSQL client
- **[zod](https://github.com/colinhacks/zod)**: TypeScript-first schema validation with static type inference
- **Docker / docker-compose**
- **OpenAPI / Swagger**: API documentation
- **Jest**: Unit and integration testing
- **[dependency-cruiser](https://github.com/sverweij/dependency-cruiser)**: Validating dependencies

## Running the application locally (docker-compose)

```bash
make run
````

This command will build the Docker containers, start the services (postgres, pgadmin, api), and apply database migrations.

To seed the database with initial data, run:

```bash
make run-seed
````

To stop the application and remove volumes, run:

```bash
make kill
````

## Running End-to-End Tests

For running end-to-end (E2E) tests, execute the following commands:

```bash
make run-e2e
make run-e2e-tests
```

These commands will prepare env variables, build the test containers, start the services, apply test database migrations, and run the E2E tests.

To stop the test environment and remove volumes, run:

```bash
make kill-e2e
```

## Running the application locally (npm)

### Installation

```bash
$ npm install --legacy-peer-deps # because of slonik dependencies
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e # requires test database

# test coverage
$ npm run test:cov
```