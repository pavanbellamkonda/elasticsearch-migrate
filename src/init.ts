import { MigrationContext, Client } from './models';

import { waitForMigrationLockRelease } from './migration-lock';
import { migrationIndexMapping, migrationLockIndexMapping } from './migration-index-mappings.constants';
import { MigrationConfig } from '..';

export async function createIndexIfNotAvailable({
  client,
  indexName,
  schema,
}: {
  indexName: string;
  client: Client;
  schema: { properties: any };
}): Promise<{ created: boolean }> {
  const { body: indexExists } = await client.indices.exists({
    index: indexName,
  });
  if (!indexExists) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: schema
      }
    });
  }
  return { created: !indexExists };
}

export async function createMigrationIndices({ indexName, client, lockIndexName }: MigrationContext) {
  const [{ created: migrationIndexCreated }, { created: migrationLockIndexCreated }] = await Promise.all([
    createIndexIfNotAvailable({ client, indexName, schema: migrationIndexMapping }),
    createIndexIfNotAvailable({ client, indexName: lockIndexName, schema: migrationLockIndexMapping })
  ]);
  return { migrationLockIndexCreated, migrationIndexCreated };
}

export async function init(config: MigrationConfig): Promise<MigrationContext> {
  let context = config as MigrationContext;
  if (!context.initialized) {
    const migrationLockTimeout = config.migrationLockTimeout || 60000;
    const lockIndexName = config.lockIndexName || (config.indexName + '_lock');
    context = {
      ...config,
      lockIndexName,
      migrationLockTimeout
    } as MigrationContext;
    const { migrationIndexCreated, migrationLockIndexCreated } = await createMigrationIndices(context);
    if (!migrationLockIndexCreated) {
      await waitForMigrationLockRelease(context);
    }
    context.migrationIndexCreated = migrationIndexCreated;
    context.migrationLockIndexCreated = migrationLockIndexCreated;
    context.initialized = true;
  }
  return context;
}