import type { MigrationConfig, MigrationContext } from './models';
import * as types from '../index';
import { forceReleaseMigrationLock } from './migration-lock'
import { init } from './init';
import { migrateLatestInternal, migrateNextInternal } from './migrate';

export class Migration implements types.Migration {
  private context!: MigrationContext;
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  async latest() {
    this.context = await init(this.config);
    this.context = await migrateLatestInternal(this.context);
  }

  async next() {
    this.context = await init(this.config);
    this.context = await migrateNextInternal(this.context);
  }

  async forceReleaseMigrationLock() {
    await forceReleaseMigrationLock(this.config);
  }

}