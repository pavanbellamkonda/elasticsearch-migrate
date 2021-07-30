import type { Client } from '@elastic/elasticsearch';
import type { SearchResponse } from '@elastic/elasticsearch/api/types';

export async function createIndexIfNotAvailable({
  client,
  indexName,
  schema,
}: {
  indexName: string;
  client: Client;
  schema: { properties: any };
}): Promise<{ created: boolean }> {
  const { body: indexExists } = await client.indices.exists({
    index: indexName,
  });
  if (!indexExists) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: schema
      }
    });
  }
  return { created: !indexExists };
}


export async function getAllRecordsInIndex<RecordType = any>({
  client,
  indexName,
}: {
  indexName: string;
  client: Client;
}): Promise<RecordType[]> {
  const { body: { count } } = await client.count<{ count: number }>({
    index: indexName
  });
  const { body: { hits: { hits: migrationRecords } } } = await client.search<SearchResponse<RecordType>>({
    index: indexName,
    size: count
  });
  return migrationRecords.map(({ _source }) => _source) as RecordType[];
}

export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}