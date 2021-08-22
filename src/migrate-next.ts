import type { MigrationRecord } from './models';
import type { MigrationContext } from '../index';

import { getAllRecordsInIndex } from './utils';
import { fetchSourceMigrations } from './fetch-source-migrations';
import { getPendingMigrations } from './get-pending-migrations';
import { runSourceMigrations } from './run-source-migrations';
import { init } from './init';

export async function migrateNext({ 
  indexName,
  directory,
  client,
  migrationLockTimeout = 60000,
  lastMigrated = null
}: MigrationContext): Promise<void> {
  const { migrationIndexCreated, migrationLockIndexCreated, lockIndexName } = await init({
    client,
    indexName,
    migrationLockTimeout
  });
  let existingMigrations: MigrationRecord[] = [];
  if (!migrationIndexCreated) {
    existingMigrations = await getAllRecordsInIndex<MigrationRecord>({
      indexName,
      client
    });
  }
  const sourceMigrations = await fetchSourceMigrations(directory);
  const migrations = getPendingMigrations(sourceMigrations, existingMigrations);
  await runSourceMigrations({ migrations, client, indexName });
}