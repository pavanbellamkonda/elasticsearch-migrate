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

  describe('init()', () => {
    beforeAll(async () => {
      await client.indices.delete({
        index: 'init_indices_class',
        ignore_unavailable: true
      })
      await client.indices.delete({
        index: 'init_indices_class_lock',
        ignore_unavailable: true
      })
    });

    it('initializes indices and updates context', async () => {
      const indexName = 'init_indices_class';
      const config =  { indexName, client } as MigrationConfig;
      const migration = new Migration(config);
      await migration['init']();
      expect(migration['context'].migrationIndexCreated).toBeTrue();
      expect(migration['context'].migrationLockIndexCreated).toBeTrue();
      expect(migration['context'].initialized).toBeTrue();
    });
  })
});