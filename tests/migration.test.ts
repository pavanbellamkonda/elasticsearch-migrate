import { Migration } from '../src/migration';
import { MigrationConfig } from '../src/models';
import { client } from './client';

describe('Migration', () => {

  it('constructor() - initializes config property', () => {
    const indexName = 'migration_constructor_nodef';
    const config =  { indexName } as MigrationConfig;
    const migration = new Migration(config);
    expect(migration['config']).toEqual(config);
  });

  it('forceReleaseMigrationLock() - updates migration lock index with false status', async () => {
    const indexName = 'migration_class_force';
    const config =  { indexName, client } as MigrationConfig;
    const migration = new Migration(config);
    await migration.forceReleaseMigrationLock();
    const { body: record } = await client.get({
      index: indexName + '_lock',
      id: 'lock'
    });
    if (record && record._source) {
      expect(record._source).toEqual({ isLocked: false });
    } else {
      fail('record does not exist');
    }
  });

});