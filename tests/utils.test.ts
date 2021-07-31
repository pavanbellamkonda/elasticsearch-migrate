import { createIndexIfNotAvailable, getRecordById } from '../src/utils';
import { migrationIndexMapping } from '../src/migration-index-mappings.constants';
import { client } from './client';

describe('createIndexIfNotAvailable()', () => {
  it('should create migration index if it does not already exist', async () => {
    spyOn(client.indices, 'exists').and.resolveTo({
      body: false
    });
    const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
    const { created } = await createIndexIfNotAvailable({
      indexName: 'migrations',
      client,
      schema: migrationIndexMapping
    });
    expect(indexCreateSpy).toHaveBeenCalled();
    expect(created).toBeTrue();
  });

  it('should not create migration index if it already exists', async () => {
    spyOn(client.indices, 'exists').and.resolveTo({
      body: true
    });
    const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
    const { created } = await createIndexIfNotAvailable({
      indexName: 'migrations',
      client,
      schema: migrationIndexMapping
    });
    expect(indexCreateSpy).not.toHaveBeenCalled();
    expect(created).toBeFalse();
  });
});

describe('getRecordById()', () => {
  it('should get record in the index for document Id if it exists', async () => {
    spyOn(client, 'get').and.resolveTo({
      body: {
        _id: 'lock',
        _source: {
          isLocked: true
        }, 
        found: true
      }
    });
    const record = await getRecordById({
      client,
      indexName: 'migrations_lock',
      id: 'lock'
    });
    expect(record).toEqual({
      isLocked: true
    });
  });

  it('should return undefined if record with document Id does not exist in the index', async () => {
    spyOn(client, 'get').and.rejectWith({
      name: 'ResponseError'
    });
    const record = await getRecordById({
      client,
      indexName: 'migrations_lock',
      id: 'lock1'
    });
    expect(record).toEqual(undefined);
  });
});