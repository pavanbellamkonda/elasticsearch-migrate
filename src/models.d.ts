export type { Client } from '@elastic/elasticsearch';
import * as es from '@elastic/elasticsearch';
import type * as types from '../index';
export type { MigrationConfig, MigrateFn, MigrateFnInput, MigrationContext } from '../index';

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
