import { migrationIndexMapping } from '../src/migration-index-mappings.constants';
import { getAllExecutedMigrations, getLastExecutedMigration, getRecordById } from '../src/queries';
import { client } from './client';

describe('getRecordById()', () => {
  it('should get record in the index for document Id if it exists', async () => {
    const indexName = 'get_record_exists_lock';
    await client.index({
      index: indexName,
      id: 'lock',
      body: {
        isLocked: true,
      },
    });
    const record = await getRecordById({
      client,
      indexName,
      id: 'lock'
    });
    expect(record).toEqual({
      isLocked: true
    });
  });

  it('should return undefined if record with document Id does not exist in the index', async () => {
    const indexName = 'get_record_not_exists_lock';
    const record = await getRecordById({
      client,
      indexName,
      id: 'lock1'
    });
    expect(record).toEqual(undefined);
  });
});

describe('getAllExecutedMigrations()', () => {
  const indexName = 'all_records';
  beforeAll(async () => {
    await client.indices.delete({
      index: indexName,
      ignore_unavailable: true
    });
    await client.indices.create({
      index: indexName
    });
  });

  it('gets all records in the index', async () => {
    const records = [];
    for (let i=0; i < 10; i++) {
      records.push({ i });
      await client.index({index: indexName, body: { i }});
    }
    await new Promise(res => setTimeout(res, 1000));
    const allRecords = await getAllExecutedMigrations({ client, indexName });//@ts-ignore
    allRecords.sort((a, b) => a.i - b.i);//@ts-ignore
    expect(allRecords).toEqual(records);
  });
});

describe('getLastExecutedMigration()', () => {
  const indexName = 'exec_migrations';
  beforeEach(async () => {
    await client.indices.delete({
      index: indexName,
      ignore_unavailable: true
    });
  });
  it('returns the latest executed migration if records exist', async () => {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: migrationIndexMapping
      }
    });
    await client.index({
      index: indexName,
      body: {
        position: 0,
        name: '0',
        time: '2021-01-01T18:45:05.812Z'
      }
    });
    await client.index({
      index: indexName,
      body: {
        position: 1,
        name: '1',
        time: '2021-02-01T18:45:05.812Z'
      }
    });
    await client.index({
      index: indexName,
      body: {
        position: 2,
        name: '2',
        time: '2019-02-01T18:45:05.812Z'
      }
    });
    await new Promise(res => setTimeout(res, 1000));
    const latestRecord = await getLastExecutedMigration({indexName, client});
    expect(latestRecord).toEqual({
      position: 1,
      name: '1',
      time: '2021-02-01T18:45:05.812Z'
    });
  });

  it('returns the latest executed migration if records exist', async () => {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: migrationIndexMapping
      }
    });
    await new Promise(res => setTimeout(res, 1000));
    const latestRecord = await getLastExecutedMigration({indexName, client});
    expect(latestRecord).toEqual(null);
  });
});