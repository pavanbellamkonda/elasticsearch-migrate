import {
  updateLock,
  forceReleaseMigrationLock,
  fetchMigrationLock,
  LOCK_RECORD_ID,
  waitForMigrationLockRelease,
} from '../src/migration-lock';
import { MigrationContext, MigrationConfig } from '../src/models';
import { client } from './client';

describe('updateLock()', () => {
  it('updates lock index with given lock status', async () => {
    const lockIndexName = 'update_lock';
    const context = { client, lockIndexName, isLocked: true };
    await updateLock(context);
    const { body: record } = await client.get({
      index: lockIndexName,
      id: 'lock',
    });
    if (record && record._source) {
      expect(record._source).toEqual({ isLocked: true });
    } else {
      fail('record does not exist');
    }
  });
});

describe('forceReleaseMigrationLock()', () => {
  it('updates lock status false in given lock index - lockIndexName provided', async () => {
    const indexName = 'force_release';
    const lockIndexName = indexName + '_lock';
    const context = { client, lockIndexName, indexName } as MigrationConfig;
    await forceReleaseMigrationLock(context);
    const { body: record } = await client.get({
      index: lockIndexName,
      id: 'lock',
    });
    if (record && record._source) {
      expect(record._source).toEqual({ isLocked: false });
    } else {
      fail('record does not exist');
    }
  });

  it('updates lock status false in given lock index - lockIndexName not provided', async () => {
    const indexName = 'force_release_not';
    const lockIndexName = indexName + '_lock';
    const context = { client, indexName } as MigrationConfig;
    await forceReleaseMigrationLock(context);
    const { body: record } = await client.get({
      index: lockIndexName,
      id: 'lock',
    });
    if (record && record._source) {
      expect(record._source).toEqual({ isLocked: false });
    } else {
      fail('record does not exist');
    }
  });
});

describe('fetchMigrationLock()', () => {
  it('should return migration lock status if migration lock record exists', async () => {
    const indexName = 'fetch_migration_lock_exists';
    const lockIndexName = indexName + '_lock';
    const context = { client, lockIndexName } as MigrationContext;
    await client.index({
      index: lockIndexName,
      id: LOCK_RECORD_ID,
      body: {
        isLocked: true,
      },
    });
    const lockStatus = await fetchMigrationLock(context);
    expect(lockStatus).toBeTrue();
  });

  it('should return false if migration lock record does not exist', async () => {
    const indexName = 'fetch_migration_lock_not_exists';
    const lockIndexName = indexName + '_lock';
    const context = { client, lockIndexName } as MigrationContext;
    const lockStatus = await fetchMigrationLock(context);
    expect(lockStatus).toBeFalse();
  });
});

describe('waitForMigrationLockRelease()', () => {
  it('polls on migration lock index and resolves promise once migration lock record is false', async () => {
    const indexName = 'fetch_migration_lock_exists';
    const lockIndexName = indexName + '_lock';
    const context = { client, lockIndexName, migrationLockTimeout: 5000 } as MigrationContext;
    await client.index({
      index: lockIndexName,
      id: LOCK_RECORD_ID,
      body: {
        isLocked: true,
      },
    });
    setTimeout(async () => {
      await client.index({
        index: lockIndexName,
        id: LOCK_RECORD_ID,
        body: {
          isLocked: false,
        },
      });
    }, 2000);
    try {
      await waitForMigrationLockRelease(context);
    } catch(err: any) {
      fail(err.message);
    }
  }, 60000);

  it('polls on migration lock index and throws MigrationLockTimedOutError once timedout', async () => {
    const indexName = 'fetch_migration_lock_exists';
    const lockIndexName = indexName + '_lock';
    const context = { client, lockIndexName, migrationLockTimeout: 5000 } as MigrationContext;
    await client.index({
      index: lockIndexName,
      id: LOCK_RECORD_ID,
      body: {
        isLocked: true,
      },
    });
    try {
      await waitForMigrationLockRelease(context);
    } catch(err: any) {
      expect(err.message).toEqual('MigrationLockTimedOutError: Migration Lock is not released before timeout 5 seconds');
    }
  }, 60000);
});
