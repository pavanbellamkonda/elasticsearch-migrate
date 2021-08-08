import type { Client } from '@elastic/elasticsearch';
import { migrationIndexMapping, migrationLockIndexMapping } from './migration-index-mappings.constants';
import { createIndexIfNotAvailable } from './utils';

export async function createMigrationIndices({ indexName, client, lockIndexName }: { indexName: string, lockIndexName: string, client: Client }) {
  const { created: migrationIndexCreated } = await createIndexIfNotAvailable({ client, indexName, schema: migrationIndexMapping });
  const { created: migrationLockIndexCreated } = await createIndexIfNotAvailable({ client, indexName: lockIndexName, schema: migrationLockIndexMapping });
  return { migrationLockIndexCreated, migrationIndexCreated };
}