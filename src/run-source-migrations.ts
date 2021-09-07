import type { Client } from '@elastic/elasticsearch';
import type { MigrationSource } from './models';

import { MigrationRunFailedError } from './errors';
import { updateLock } from './update-lock';

export async function runSourceMigrations({
  migrations,
  client,
  indexName
}: {
  migrations: MigrationSource[];
  client: Client;
  indexName: string;
}) {
  const lockIndexName = indexName + '_lock';
  await updateLock({ client, lockIndexName, isLocked: true });
  for (const migration of migrations) {
    try {
      await migration.migrate(client);
    } catch (err) {
      await updateLock({ client, lockIndexName, isLocked: false });
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
  await updateLock({ client, lockIndexName, isLocked: false });
}
