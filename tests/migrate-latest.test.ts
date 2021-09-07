import { migrateLatest } from '../src/migrate-latest';
import { client } from './client';

describe('migrateLatest()', () => {
  it('should migrate', async () => {
    // spyOn(client.indices, 'exists').and.resolveTo({
    //   body: false
    // });
    // const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
    await migrateLatest({
      indexName: 'migrations',
      client,
      directory: __dirname + '/es-migrations'
    });
    // expect(indexCreateSpy).toHaveBeenCalled();
  });
});