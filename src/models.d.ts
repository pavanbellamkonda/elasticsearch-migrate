export type { Client } from '@elastic/elasticsearch';
import * as es from '@elastic/elasticsearch';
import type * as types from '../index';
export type { MigrationConfig, MigrateFn, MigrateFnInput } from '../index';

export interface MigrationContext extends types.MigrationConfig {
  lockIndexName: string;
  initialized: boolean;
  migrationLockTimeout: number;
  migrationIndexCreated: boolean;
  migrationLockIndexCreated: boolean;
  sourceMigrations: SourceMigration[];
  pendingMigrations: SourceMigration[];
  executedMigrations?: ExecutedMigration[];
  lastExecutedMigration: ExecutedMigration | null;
}

export interface FetchRecordsInput {
  indexName: string;
  client: Client;
}

export interface ExecutedMigration {
  name: string;
  position: number;
  time: string;
}

export interface SourceMigration {
  path: string;
  position: number;
  name: string;
}
