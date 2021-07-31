import type { ApiResponse, Client } from '@elastic/elasticsearch';
import type { SearchResponse, GetResponse } from '@elastic/elasticsearch/api/types';

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

export async function getRecordById<RecordType = any>({
  client,
  indexName,
  id
}: {
  indexName: string;
  client: Client;
  id: string;
}): Promise<RecordType | undefined> {
  let response: ApiResponse<GetResponse<RecordType>, unknown>;
  try {
    response = await client.get<GetResponse<RecordType>>({
      index: indexName,
      id
    });
  } catch (err) {
    return;
  }
  if (response.body.found) {
    return response.body._source;
  }
}

export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}