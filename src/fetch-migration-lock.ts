import { FetchRecordsInput } from './models';
import { getRecordById } from './utils';

export async function fetchMigrationLock({ indexName, client }: FetchRecordsInput) {
  const migrationLockRecord = await getRecordById<{isLocked: boolean}>({ 
    client,
    indexName,
    id: 'lock'
  });
  if (migrationLockRecord) {
    return migrationLockRecord.isLocked;
  }
  return false;
}