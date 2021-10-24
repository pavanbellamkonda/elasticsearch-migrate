import type { MigrationContext, MigrationConfig,Client } from './models';
import { MigrationLockTimedOutError } from './errors';
import { getRecordById } from './queries';

export const LOCK_RECORD_ID = 'lock';

export async function updateLock({
  client,
  lockIndexName,
  isLocked
}: { isLocked: boolean, client: Client, lockIndexName: string }) {
  await client.index({
    index: lockIndexName,
    id: LOCK_RECORD_ID,
    body: {
      isLocked
    },
  });
}

export async function forceReleaseMigrationLock({ indexName, lockIndexName, client }: MigrationConfig) {
  if (!lockIndexName) {
    lockIndexName = indexName + '_lock';
  }
  await updateLock({ client, lockIndexName, isLocked: false });
}

export async function fetchMigrationLock({ lockIndexName, client }: MigrationContext) {
  const migrationLockRecord = await getRecordById<{isLocked: boolean}>({
    client,
    indexName: lockIndexName,
    id:LOCK_RECORD_ID
  });
  if (migrationLockRecord) {
    return migrationLockRecord.isLocked;
  }
  return false;
}

export async function waitForMigrationLockRelease(context: MigrationContext) {
  const { migrationLockTimeout } = context;
  const pollInterval = Math.min(Math.floor(migrationLockTimeout / 10), 1000);
  let migrationLocked = await fetchMigrationLock(context);
  let migrationTimedOut = false;
  if (migrationLocked) {
    setTimeout(() => {
      migrationTimedOut = true;
    }, migrationLockTimeout);
    while(!migrationTimedOut && migrationLocked) {
      migrationLocked = await fetchMigrationLock(context);
      await new Promise((res) => setTimeout(() => res(true), pollInterval));
    }
    if (migrationTimedOut) {
      throw new MigrationLockTimedOutError(migrationLockTimeout);
    }
  }
}
