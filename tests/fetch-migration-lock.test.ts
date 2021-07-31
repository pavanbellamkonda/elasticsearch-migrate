import { fetchMigrationLock } from '../src/fetch-migration-lock';
import * as utils from '../src/utils';
import { client } from './client';

describe('fetchMigrationLock()', () => {
  it('should return migration lock status if migration lock record exists', async () => {
    spyOn(utils, 'getRecordById').and.resolveTo({
      isLocked: true
    });
    const lockStatus = await fetchMigrationLock({
      client,
      indexName: 'migrations_lock'
    });
    expect(lockStatus).toBeTrue();
  });

  it('should return false if migration lock record does not exist', async () => {
    spyOn(utils, 'getRecordById').and.resolveTo(undefined);
    const lockStatus = await fetchMigrationLock({
      client,
      indexName: 'migrations_lock'
    });
    expect(lockStatus).toBeFalse();
  });
});