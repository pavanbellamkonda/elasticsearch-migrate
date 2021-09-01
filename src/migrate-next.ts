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
  migrationLockTimeout = 60000
}: MigrationContext): Promise<boolean> {
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
  if (migrations.length > 0) {
    await runSourceMigrations({ migrations: [migrations[0]], client, indexName });
    return true;
  }
  return false;
}