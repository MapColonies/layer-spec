# layer-spec 
----------------------------------


This service exposes CRUD (Create, Read, Update and Delete) operations into/from layer-spec database.

### Template Features:

- eslint configuration by [@map-colonies/eslint-config](https://github.com/MapColonies/eslint-config)

- prettier configuration by [@map-colonies/prettier-config](https://github.com/MapColonies/prettier-config)

- jest

- .nvmrc

- Multi stage producton-ready Dockerfile

- commitlint

- git hooks

- logging by [@map-colonies/js-logger](https://github.com/MapColonies/js-logger)

- OpenAPI request validation

- config load with [node-config](https://www.npmjs.com/package/node-config)

- Tracing and metrics by [@map-colonies/telemetry](https://github.com/MapColonies/telemetry)

- github templates

- bug report

- feature request

- pull request

- github actions

- on pull_request

- LGTM

- test

- lint

- snyk

## API
Checkout the OpenAPI spec [here](/openapi3.yaml)

## Installation

Install deps with npm

```bash
npm install
```

## Run Locally

Clone the project

```bash

git clone https://link-to-project

```

Go to the project directory

```bash

cd my-project

```

Install dependencies

```bash

npm install

```

Start the server

```bash

npm run start

```

## Running Tests

To run tests, run the following command

```bash

npm run test

```

To only run unit tests:
```bash
npm run test:unit
```

To only run integration tests:
```bash
npm run test:integration
```

## Configurations

ENVS:

SERVER_PORT set the server port number - deafult to 8080

LOG_LEVEL set the log level *based on 'winston' logger, available values as declared in winston logger docs, default to 'info'


DB Configurations:

if MAPPROXY_FILE_PROVIDER is set to 'db' make sure to declare next envs

DB_HOST set the server host , deafult to 'localhost'

DB_USER set the database username, default to 'postgres'

DB_PASSWORD set the database password, default to 'postgres'

DB_NAME set the database name, no default value

DB_PORT set the database port, default to 5432

DB_SSL_ENABLE set to true if you wished to use database ssl. default to false

DB_REJECT_UNAUTHORIZED if true, the server certificate is verified against the list of supplied CAs

DB_SSL_CA set the path to the CA file

DB_SSL_KEY set the path to the KEY file

DB_SSL_CERT set the path to the CERT file
