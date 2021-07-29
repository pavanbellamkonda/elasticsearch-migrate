import type { Client } from '@elastic/elasticsearch';

export interface MigrationConfig {
  indexName: string;
  directory: string;
  client: Client;
};