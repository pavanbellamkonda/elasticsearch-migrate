import { TransportRequestCallback } from '@elastic/elasticsearch/lib/Transport';
import { fetchExistingMigrations } from '../src/fetch-existing-migrations';
import { client } from './client';

describe('fetchExisitngMigration()', () => {
  it('should fetch all existing migrations in migrations index', async () => {
    const countSpy = spyOn(client, 'count').and.resolveTo({
      body: {
        count: 10
      },
      abort: () => {}
    } as TransportRequestCallback);
    const searchSpy = spyOn(client, 'search').and.resolveTo({
      body: {
        hits: {
          hits: [
            {
              _source: {
                migrationName: 'create'
              }
            }
          ]
        }
      }
    });
    const records = await fetchExistingMigrations({
      indexName: 'migration',
      client
    });
    // expect(records).toEqual([{migrationName: 'create'}]);
  });
});