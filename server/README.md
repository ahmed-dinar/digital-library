# Digital Library Backend

## Perquisites

Before you run the backend, make sure the database docker is running and up.
The local PostgreSQL database is running on port `5434`. Please find the connection url in `.env` file.

> [!NOTE]
> Make sure you have [docker](https://www.docker.com/) and [docker compose](https://docs.docker.com/compose/) installed
> in your machine.
> Docker compose version should be >= 2.2

```bash
$ docker-compose -f ../docker-compose-db.yml up
```

## Installation

```bash
$ yarn install
```

## Database initialization

Once the database is up and running, execute the following command to create necessary tables for the first time.

```bash
$ npx prisma migrate dev --name init
```

## Running the app

```bash
# development watch mode
$ yarn run start:dev

# to the linting the code
$ yarn lint

# to build the prod build
$ yarn build

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e
```

## License

Nest is [MIT licensed](LICENSE).
