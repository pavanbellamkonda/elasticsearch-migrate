# elasticsearch-migrate
Tool to run migrations in Elasticsearch.

## Usage

About MigrationConfig

```ts
interface MigrationConfig {
  /**
   * Name of the index in which the migrations
   * have to be stored/read.
   */
  indexName: string;
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
}
```

```ts
import { migrateLatest, migrateNext } from 'elasticsearch-migrate';

// Run all migrations

await migrateLatest({
  indexName: 'myserver_migrations',
  client,
  directory: '/src/db/es-migrations'
});

// Run next migration

await migrateNext({
  indexName: 'myserver_migrations',
  client,
  directory: '/src/db/es-migrations'
});
```

Example Migration file

```ts
export function migrate(client) {
  await client.indices.create({
    index: 'myindex',
    body: {
      mappings: {}
    }
  });
}
```
The exported function must be named `migrate` for the migrations to run.

Inspired by knex-migrations (https://knexjs.org/#Migrations).