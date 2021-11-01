import type { Client } from '@elastic/elasticsearch';

export interface MigrationConfig {
  /**
   * Name of the index in which the migrations
   * have to be stored/read.
   */
  indexName: string;
  /**
   * (!!OPTIONAL)
   * Name of the index in which the migration lock
   * has to be stored.
   * If not provided, will be created as 
   * indexName + '_lock'
   */
  lockIndexName?: string;
  /**
   * Relative path to the directory in which migration
   * files are present
   */
  directory: string;
  /**
   * Elasticsearch Node.js client instance
   */
  client: Client;
  /**
   * Timeout to wait until the migration
   * lock is released.
   * Default: 60000
   */
  migrationLockTimeout?: number;
  /**
   * Flag to disable validation if already executed migrations
   * are present in the source directory or not
   * Default: false
   */
  disableMigrationsValidation?: boolean;
}

export declare function migrateLatest(config: MigrationConfig): Promise<void>;
export declare function forceReleaseMigrationLock(config: MigrationConfig): Promise<void>;

export declare class Migration {
  constructor(config: MigrationConfig) {}

  latest = async () => {}
  forceReleaseMigrationLock = async () => {}
}

export interface MigrateFnInput {
  client: Client;
}

export type MigrateFn = (_: MigrateFnInput) => Promise<any>;
