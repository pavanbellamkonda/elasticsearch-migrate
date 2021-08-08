import type { Client } from '@elastic/elasticsearch';
import { getRecordById } from './utils';

export async function fetchMigrationLock({ lockIndexName, client }: { lockIndexName: string, client: Client}) {
  const migrationLockRecord = await getRecordById<{isLocked: boolean}>({ 
    client,
    indexName: lockIndexName,
    id: 'lock'
  });
  if (migrationLockRecord) {
    return migrationLockRecord.isLocked;
  }
  return false;
}