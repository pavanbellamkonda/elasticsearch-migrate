// import { runMigrations } from '../src/run-migrations';
// import * as fetchExistingMigrations from '../src/fetch-existing-migrations';
// import { client } from './client';

// describe('runMigrations()', () => {
//   it('should migrate', async () => {
//     // spyOn(client.indices, 'exists').and.resolveTo({
//     //   body: false
//     // });
//     // const indexCreateSpy = spyOn(client.indices, 'create').and.stub();
//     await runMigrations({
//       indexName: 'migrations',
//       client,
//       directory: '/tests/es-migrations'
//     });
//     // expect(indexCreateSpy).toHaveBeenCalled();
//   });
// });