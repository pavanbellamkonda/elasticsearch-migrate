import { createIndexIfNotAvailable } from '../src/utils';
import { migrationIndexMapping } from '../src/migration-index-mappings';
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