import type { MigrationContext, ExecutedMigration, MigrationConfig } from './models';

import { getAllExecutedMigrations, getLastExecutedMigration } from './queries';
import { fetchSourceMigrations, getPendingSourceMigrations, runMigrations, validateExecutedMigrationsExist } from './source-migrations';
import { init } from './init';

export async function migrateLatest(config: MigrationConfig): Promise<void> {
  const context = await init(config);
  await migrateLatestInternal(context);
}

export async function migrateLatestInternal(context: MigrationContext) {
  const { indexName, client, directory } = context;
  const sourceMigrations = await fetchSourceMigrations(directory);
  if (!context.disableMigrationsValidation) {
    let executedMigrations: ExecutedMigration[] = [];
    if (!context.migrationIndexCreated) {
      executedMigrations = await getAllExecutedMigrations({
        indexName,
        client
      });
    }
    if (executedMigrations.length > 0) {
      validateExecutedMigrationsExist(executedMigrations, sourceMigrations);
      context.lastExecutedMigration = executedMigrations[executedMigrations.length - 1];
    } else {
      context.lastExecutedMigration = null;
    }
  } else {
    context.lastExecutedMigration = await getLastExecutedMigration({ indexName, client });
  }
  if (context.lastExecutedMigration) {
    context.pendingMigrations = getPendingSourceMigrations(sourceMigrations, context.lastExecutedMigration);
  } else {
    context.pendingMigrations = sourceMigrations;
  }
  await runMigrations(context);
}