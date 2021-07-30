import type { MigrationRecord, MigrationConfig } from './models';

import { fetchExistingMigrations } from './fetch-existing-migrations';
import { createIndexIfNotAvailable } from './utils';
import { migrationIndexMapping, migrationLockIndexMapping } from './migration-index-mappings.constants';
import { fetchSourceMigrations } from './fetch-source-migrations';
import { getPendingMigrations } from './get-pending-migrations';
import { runSourceMigrations } from './run-source-migrations';


export async function runMigrations({ indexName, directory, client }: MigrationConfig): Promise<void> {
  const lockIndexName = indexName + '_lock';
  const { created: migrationIndexCreated } = await createIndexIfNotAvailable({ client, indexName, schema: migrationIndexMapping})
  await createIndexIfNotAvailable({ client, indexName: lockIndexName, schema: migrationLockIndexMapping})
  let existingMigrations: MigrationRecord[] = [];
  if (!migrationIndexCreated) {
    existingMigrations = await fetchExistingMigrations({
      indexName,
      client
    });
  }
  const sourceMigrations = await fetchSourceMigrations(directory);
  const migrations = getPendingMigrations(sourceMigrations, existingMigrations);
  await runSourceMigrations({ migrations, client, indexName });
}