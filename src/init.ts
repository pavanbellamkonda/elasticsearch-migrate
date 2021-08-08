import type { Client } from '@elastic/elasticsearch';
import { createMigrationIndices } from './create-migration-indices';

import { waitForMigrationLockRelease } from './wait-for-migration-lock-release';

export async function init({ client, indexName, migrationLockTimeout }: { indexName: string, client: Client, migrationLockTimeout: number }) {
  const lockIndexName = indexName + '_lock';
  const { migrationIndexCreated, migrationLockIndexCreated } = await createMigrationIndices({ indexName, client, lockIndexName });
  if (!migrationLockIndexCreated) {
    await waitForMigrationLockRelease({ client, lockIndexName, migrationLockTimeout });
  }
  return { migrationIndexCreated, migrationLockIndexCreated, lockIndexName };
}