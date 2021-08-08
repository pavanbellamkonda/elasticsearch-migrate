import type { Client } from '@elastic/elasticsearch';
import { MigrationLockTimedOutError } from './errors';
import { fetchMigrationLock } from './fetch-migration-lock';

export async function waitForMigrationLockRelease({ client, lockIndexName, migrationLockTimeout }: { lockIndexName: string, client: Client, migrationLockTimeout: number }) {
  let migrationLocked = await fetchMigrationLock({ lockIndexName, client });
  let migrationTimedOut = false;
  if (migrationLocked) {
    setTimeout(() => {
      migrationTimedOut = true;
    }, migrationLockTimeout);
    while(!migrationTimedOut && migrationLocked) {
      migrationLocked = await fetchMigrationLock({ lockIndexName, client });
      await new Promise((res) => setTimeout(() => res(true), 5000));
    }
    if (migrationTimedOut) {
      throw new MigrationLockTimedOutError(migrationLockTimeout);
    }
  }
}