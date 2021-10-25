import type { MigrationContext, ExecutedMigration, MigrationConfig } from './models';

import { getAllExecutedMigrations, getLastExecutedMigration } from './queries';
import { fetchSourceMigrations, getPendingSourceMigrations, executeMigrations, validateExecutedMigrationsExist } from './source-migrations';
import { init } from './init';

export async function migrateLatest(config: MigrationConfig): Promise<MigrationContext> {
  const context = await init(config);
  return migrateLatestInternal(context);
}

export async function migrateLatestInternal(context: MigrationContext): Promise<MigrationContext> {
  context = await migrateInit(context);
  return await executeMigrations(context);
}

export async function migrateNext(config: MigrationContext | MigrationConfig) {
  const context = await init(config);
  return migrateNextInternal(context);
}

export async function migrateNextInternal(context: MigrationContext) {
  context = await migrateInit(context);
  return await executeMigrations(context, { onlyFirst: true });
}

export async function migrateInit(context: MigrationContext) {
  if (!context.migrateInitialized) {
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
    context.migrateInitialized = true;
  }
  return context;
}
