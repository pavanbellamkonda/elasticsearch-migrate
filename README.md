# elasticsearch-migrate
Tool to run migrations to create/modify Elasticsearch index mapping.

## Usage

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