// import { TransportRequestCallback } from '@elastic/elasticsearch/lib/Transport';
// import { fetchExistingMigrations } from '../src/fetch-existing-migrations';
// import { client } from './client';

// describe('fetchExisitngMigration()', () => {
//   it('should fetch all existing migrations in migrations index', async () => {
//     spyOn(client, 'count').and.resolveTo({
//       body: {
//         count: 10
//       },
//       abort: () => {}
//     } as TransportRequestCallback);
//     spyOn(client, 'search').and.resolveTo({
//       body: {
//         hits: {
//           hits: [
//             {
//               _id: 0,
//               _source: {
//                 id: 0,
//                 time: '',
//                 name: '01-create.ts'
//               }
//             }
//           ]
//         }
//       }
//     });
//     const records = await fetchExistingMigrations({
//       indexName: 'migration',
//       client
//     });
//     expect(records).toEqual([{
//       id: 0,
//       time: '',
//       name: '01-create.ts'
//     }]);
//   });
// });