import { migrate } from '../src/migrate';
import * as fetchExistingMigrations from '../src/fetch-existing-migrations';
import { client } from './client';

describe('migrate()', () => {
  it('should create migration index if it does not already exist', async () => {
    spyOn(client.indices, 'exists').and.resolveTo({
      body: false
    });
    const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
    await migrate({
      indexName: 'migrations',
      client,
      directory: ''
    });
    expect(indexCreateSpy).toHaveBeenCalled();
  });

  it('should not create migration index if it already exists', async () => {
    spyOn(client.indices, 'exists').and.resolveTo({
      body: true
    });
    spyOn(fetchExistingMigrations, 'fetchExistingMigrations').and.resolveTo([]);
    const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
    await migrate({
      indexName: 'migrations',
      client,
      directory: ''
    });
    expect(indexCreateSpy).not.toHaveBeenCalled();
  });
});