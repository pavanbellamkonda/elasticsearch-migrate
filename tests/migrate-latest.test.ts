// import { migrateLatest } from '../src/migrate-latest';
// import * as fetchExistingMigrations from '../src/fetch-existing-migrations';
// import { client } from './client';

// describe('migrateLatest()', () => {
//   it('should migrate', async () => {
//     // spyOn(client.indices, 'exists').and.resolveTo({
//     //   body: false
//     // });
//     // const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
//     await migrateLatest({
//       indexName: 'migrations',
//       client,
//       directory: '/tests/es-migrations'
//     });
//     // expect(indexCreateSpy).toHaveBeenCalled();
//   });
// });