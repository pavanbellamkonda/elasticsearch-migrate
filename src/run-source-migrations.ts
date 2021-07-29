import type { Client } from '@elastic/elasticsearch';
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
    body: {
      isLocked: true
    }
  });
  for (const migration of migrations) {
    await migration.migrate(client);
    await client.index({
      index: indexName,
      body: {
        name: migration.fileName,
        id: migration.id,
        time: new Date().toISOString()
      }
    });
  }
  await client.index({
    index: indexName + '_lock',
    body: {
      isLocked: false
    }
  });
}
