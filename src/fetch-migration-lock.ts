import { FetchRecordsInput } from './models';
import { getAllRecordsInIndex } from './utils';

export async function fetchMigrationLock({ indexName, client }: FetchRecordsInput) {
  const migrationLockRecords = await getAllRecordsInIndex<{isLocked: boolean}>({ 
    client,
    indexName
  });
  if (migrationLockRecords.length === 1) {
    return migrationLockRecords[0].isLocked;
  }
  return false;
}