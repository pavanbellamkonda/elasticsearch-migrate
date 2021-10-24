import type { MigrationConfig, MigrationContext } from './models';
import { forceReleaseMigrationLock } from './migration-lock'
import { init } from './init';
import { migrateLatestInternal } from './migrate-latest';

export class Migration {
  private context!: MigrationContext;
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  async latest() {
    if (!this.context?.initialized) {
      await this.init();
    }
    await migrateLatestInternal(this.context);
  }

  async forceReleaseMigrationLock() {
    await forceReleaseMigrationLock(this.config);
  }

  private async init() {
    this.context = await init(this.config);
  }

}