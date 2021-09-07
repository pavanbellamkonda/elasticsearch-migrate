import { fetchSourceMigrations } from '../src/fetch-source-migrations';

describe('fetchSourceMigrations()', () => {
  it('should fetch all existing migrations in migrations index', async () => {
    await fetchSourceMigrations(__dirname + '/es-migrations'); 
  });
});