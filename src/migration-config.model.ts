import type { Client } from '@elastic/elasticsearch';

export type MigrationConfig = {
  indexName: string;
  directory: string;
  client: Client;
};