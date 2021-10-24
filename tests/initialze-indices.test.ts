import { init, createMigrationIndices, createIndexIfNotAvailable } from '../src/init';
import { migrationIndexMapping } from '../src/migration-index-mappings.constants';
import { MigrationContext } from '../src/models';
import { client } from './client';


describe('createIndexIfNotAvailable()', () => {
  beforeAll(async () => {
    await client.indices.delete({
      index: 'create_index_not_available',
      ignore_unavailable: true
    })
    await client.indices.delete({
      index: 'create_index_available',
      ignore_unavailable: true
    })
  });

  it('should create migration index if it does not already exist', async () => {
    const { created } = await createIndexIfNotAvailable({
      indexName: 'create_index_not_available',
      client,
      schema: migrationIndexMapping
    });
    expect(created).toBeTrue();
  });

  it('should not create migration index if it already exists', async () => {
    const indexName = 'create_index_available';
    await client.indices.create({
      index: indexName,
      body: {
        mappings: {}
      }
    });
    const { created } = await createIndexIfNotAvailable({
      indexName,
      client,
      schema: migrationIndexMapping
    });
    expect(created).toBeFalse();
  });

});

describe('createMigrationIndices()', () => {
  beforeAll(async () => {
    await client.indices.delete({
      index: 'create_migrations',
      ignore_unavailable: true
    })
    await client.indices.delete({
      index: 'create_migrations_lock',
      ignore_unavailable: true
    })
  });

  it('creates migration and migration lock indices if not available', async () => {
    const indexName = 'create_migrations';
    const lockIndexName = indexName + '_lock';
    const context = { client, indexName, lockIndexName } as MigrationContext;
    const { migrationIndexCreated, migrationLockIndexCreated } = await createMigrationIndices(context);
    expect(migrationIndexCreated).toBeTrue();
    expect(migrationLockIndexCreated).toBeTrue();
  });
});

describe('init()', () => {
  beforeAll(async () => {
    await client.indices.delete({
      index: 'init_indices_available',
      ignore_unavailable: true
    })
    await client.indices.delete({
      index: 'init_indices_available_lock',
      ignore_unavailable: true
    });
    await client.indices.delete({
      index: 'init_indices_unavailable',
      ignore_unavailable: true
    })
    await client.indices.delete({
      index: 'init_indices_unavailable_lock',
      ignore_unavailable: true
    });
  });

  it('creates migration indices if not available and waits for migration lock release if migration lock index already available', async () => {
    const indexName = 'init_indices_available';
    const lockIndexName = indexName + '_lock';
    await client.indices.create({
      index: 'init_indices_available'
    })
    await client.indices.create({
      index: 'init_indices_available_lock'
    });
    await client.index({
      index: lockIndexName,
      id: 'lock',
      body: {
        isLocked: false,
      },
    });
    const context = { client, indexName, lockIndexName, migrationLockTimeout: 5000 } as MigrationContext;
    const { migrationIndexCreated, migrationLockIndexCreated, initialized } = await init(context);
    expect(migrationIndexCreated).toBeFalse();
    expect(migrationLockIndexCreated).toBeFalse();
    expect(initialized).toBeTrue();
  });

  it('creates migration indices if not available and does not wait for migration lock release if migration lock index does not already exist', async () => {
    const indexName = 'init_indices_unavailable';
    const lockIndexName = indexName + '_lock';
    const context = { client, indexName, lockIndexName, migrationLockTimeout: 5000 } as MigrationContext;
    const { migrationIndexCreated, migrationLockIndexCreated, initialized } = await init(context);
    expect(migrationIndexCreated).toBeTrue();
    expect(migrationLockIndexCreated).toBeTrue();
    expect(initialized).toBeTrue();
  });
});
