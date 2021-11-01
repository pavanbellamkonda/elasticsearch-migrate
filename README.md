# elasticsearch-migrate

![npm version](https://badge.fury.io/js/elasticsearch-migrate.svg)

Package to help you run one time migrations into your Elasticsearch DB such as Creating an index, inserting master data etc.

## What it does

Two indices will be created in your Elasticsearch instance.

#### Example: nodejs_migrations, nodejs_migrations_lock


One for storing the migration file names that already ran, other for updating a lock if the migrations are running currently, to avoid duplication of migrations in a muliple instances scenario. 


## How to use elasticsearch-migrate

Assuming the below project structure
```
├── src
│  │──db
│  │  ├── bootstrap-db.js
│  │  ├── es-client.js
│  │  ├── es-migrations
│  │  │  ├── 01-create-index.js
│  │  │  ├── 02-update-schema.js
│  │  │  ├── 03-update-again.js
│  │  │  └── 04-update-4.js
│  │──index.js

```
With below file contents

`index.js`
```js
import { bootstrapDb } from './db/bootstrap-db';

bootstrapDb();
```
`db/es-client.js` Exports the Elasticsearch client instance
```js
import { Client } from '@elastic/elasticsearch';

export const client = new Client({
  node: process.env.ELASTICSEARCH_HOST
});
```

`db/bootstrap-db.js`
```js
import { migrateLatest, Migration } from 'elasticsearch-migrate';
import { client } from './es-client';

export async function bootstrapDb() {
  /** @type {import('elasticsearch-migrate').MigrationConfig} */
  const migrationConfig = {
    indexName: 'documents_migrations',
    client,
    directory: __dirname + '/es-migrations'
  };
  await migrateLatest(migrationConfig);
  /*
   ██████╗ ██████╗ 
  ██╔═══██╗██╔══██╗
  ██║   ██║██████╔╝
  ██║   ██║██╔══██╗
  ╚██████╔╝██║  ██║
   ╚═════╝ ╚═╝  ╚═╝
   */

  const migration = new Migration(migrationConfig);
  await migration.latest();
}
```
Read more about the input given to `migrateLatest` below

```ts
interface MigrationConfig {
  /**
   * Name of the index in which the migrations
   * have to be stored/read.
   */
  indexName: string;
  /**
   * (!!OPTIONAL)
   * Name of the index in which the migration lock
   * has to be stored.
   * If not provided, will be created as 
   * indexName + '_lock'
   */
  lockIndexName?: string;
  /**
   * Relative path to the directory in which migration
   * files are present
   */
  directory: string;
  /**
   * Elasticsearch Node.js client instance
   */
  client: Client;
  /**
   * Timeout to wait until the migration
   * lock is released.
   * Default: 60000
   */
  migrationLockTimeout?: number;
  /**
   * Flag to disable validation if already executed migrations
   * are present in the source directory or not
   * Default: false
   */
  disableMigrationsValidation?: boolean;
}
```
`db/es-migrations/01-create-index.js`
Example Migration file
### Javascript
```js
/**
 * @param {import('elasticsearch-migrate').MigrateFnInput}
 */
export async function migrate({ client }) {
  await client.indices.create({
    index: 'new_index',
    body: {
      mappings: {
        properties: {}
      }
    }
  });
}
```
### Typescript
```ts
import { MigrateFnInput } from 'elasticsearch-migrate';

export async function migrate({ client }: MigrateFnInput) {
  await client.indices.create({
    index: 'new_index',
    body: {
      mappings: {
        properties: {}
      }
    }
  });
}
```
The exported function must be named `migrate` for the migrations to run.

Once the above function is executed succesfully (as-in the Promise is resolved without error), a record with the filename will be inserted in `documents_migrations`, and will be skipped execution in future as it is present in the index.

## Errors
Error | Reason |
--- | --- |
MigrateFunctionImportFailedError | If importing migrate function from migration file fails. Only CommonJS modules supported as of now. |
MigrationLockTimedOutError | If the `migrationLockTimeout` value is exceeded. Default: `60000` ms. If you don't have muliple instances and still the issue araises, try releasing the lock manually |
MigrationFileMissingError | If a record with migration file name exists in migrations index, but not in the given migrations directory. Check if you have accidentally deleted a file in the directory |
MigrationRunFailedError | If an error is thrown by a migrate function while running it. Use try/catch blocks to narrow down the issue.

## Coming Soon!
- migrateNext() and migration.latest()
- Save checkpoints in your migrations
- and any new ideas/suggestions!

Inspired by knex-migrations (https://knexjs.org/#Migrations).
