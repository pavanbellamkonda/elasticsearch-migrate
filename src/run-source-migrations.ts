import type { Client } from '@elastic/elasticsearch';
import { MigrationRunFailedError } from './errors';
import type { MigrationSource } from './models';

export async function runSourceMigrations({
  migrations,
  client,
  indexName
}: {
  migrations: MigrationSource[];
  client: Client;
  indexName: string;
}) {
  await client.index({
    index: indexName + '_lock',
    id: 'lock',
    body: {
      isLocked: true
    }
  });
  for (const migration of migrations) {
    try {
      await migration.migrate(client);
    } catch (err) {
      throw new MigrationRunFailedError(err.message, migration.fileName);
    }
    await client.index({
      index: indexName,
      id: String(migration.id),
      body: {
        name: migration.fileName,
        id: migration.id,
        time: new Date().toISOString()
      }
    });
  }
  await client.index({
    index: indexName + '_lock',
    id: 'lock',
    body: {
      isLocked: false
    }
  });
}
