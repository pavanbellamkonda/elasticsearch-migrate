import type { Client } from '@elastic/elasticsearch';

export interface MigrationSource {
  migrate: (client: Client) => Promise<void>;
  path: string;
  id: number;
  fileName: string;
  skip: boolean;
}
