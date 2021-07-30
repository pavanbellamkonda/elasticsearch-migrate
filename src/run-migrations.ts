import type { MigrationRecord } from './models';
import type { MigrationConfig } from '../index';

import { createIndexIfNotAvailable, getAllRecordsInIndex } from './utils';
import { migrationIndexMapping, migrationLockIndexMapping } from './migration-index-mappings.constants';
import { fetchSourceMigrations } from './fetch-source-migrations';
import { getPendingMigrations } from './get-pending-migrations';
import { runSourceMigrations } from './run-source-migrations';
import { fetchMigrationLock } from './fetch-migration-lock';

export async function runMigrations({ 
  indexName,
  directory,
  client,
  migrationLockTimeout = 60000 
}: MigrationConfig): Promise<void> {
  const lockIndexName = indexName + '_lock';
  const { created: migrationIndexCreated } = await createIndexIfNotAvailable({ client, indexName, schema: migrationIndexMapping });
  const { created: migrationLockIndexCreated } = await createIndexIfNotAvailable({ client, indexName: lockIndexName, schema: migrationLockIndexMapping });
  let isMigrationLocked = false;
  if (!migrationLockIndexCreated) {
    isMigrationLocked = await fetchMigrationLock({ client, indexName: lockIndexName });
  }
  if (isMigrationLocked) {
    
  }
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