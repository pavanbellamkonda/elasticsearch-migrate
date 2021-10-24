import type { ApiResponse, Client } from '@elastic/elasticsearch';
import type { SearchResponse, GetResponse } from '@elastic/elasticsearch/api/types';
import type { ExecutedMigration } from './models';

export async function getAllExecutedMigrations({
  client,
  indexName,
}: {
  indexName: string;
  client: Client;
}): Promise<ExecutedMigration[]> {
  const { body: { hits: { hits: records } } } = await client.search<SearchResponse<ExecutedMigration>>({
    index: indexName,
    size: 10000
  });
  return records.map(({ _source }) => _source) as ExecutedMigration[];
}

export async function getLastExecutedMigration({
  client,
  indexName,
}: {
  indexName: string;
  client: Client;
}): Promise<ExecutedMigration | null> {
  const { body: { hits: { hits: records } } } = await client.search<SearchResponse<ExecutedMigration>>({
    index: indexName,
    size: 1,
    body: {
      sort: {
        time: 'desc'
      }
    }
  });
  if (records.length > 0) {
    return records[0]._source as ExecutedMigration;
  }
  return null;
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
  try {
    const { body: { found, _source } }: ApiResponse<GetResponse<RecordType>, unknown> = await client.get<GetResponse<RecordType>>({
      index: indexName,
      id
    });
    if (found) {
      return _source;
    }
  } catch (err) {
    return;
  }
}
