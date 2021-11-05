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

  it('full test', async () => {
    await client.indices.delete({
      index: String(process.env.indexName),
      ignore_unavailable: true
    });
    await client.indices.delete({
      index: 'migration_integration',
      ignore_unavailable: true
    });
    await client.indices.delete({
      index: 'migration_integration_lock',
      ignore_unavailable: true
    });
    const indexName = 'migration_integration';
    const config: MigrationConfig =  { indexName, client, directory: __dirname + '/es-migrations' };
    const migration = new Migration(config);
    await migration.latest();
    const { body: mapping } = await client.indices.getMapping({ index: String(process.env.indexName) });
    console.log(JSON.stringify(mapping, null, 2));
    expect(mapping).toEqual({
      my_index: {
        mappings: {
          properties: {
            firstName: {
              type: 'keyword',
            },
            lastname: {
              type: 'keyword',
            },
            name: {
              type: 'text',
            },
            username: {
              type: 'text',
            },
          },
        },
      },
    });
  });

});