import type { Client } from '@elastic/elasticsearch';
import type { SearchResponse } from '@elastic/elasticsearch/api/types';
import type { MigrationRecord } from './models';

type FetchMigrationsInput = { indexName: string, client: Client };

export async function fetchExistingMigrations({ indexName, client }: FetchMigrationsInput): Promise<MigrationRecord[]> {
  const { body: { count } } = await client.count<{ count: number }>({
    index: indexName
  });
  const { body: { hits: { hits: migrationRecords } } } = await client.search<SearchResponse<MigrationRecord>>({
    index: indexName,
    size: count
  });
  return migrationRecords.map(({ _source }) => _source) as MigrationRecord[];
}