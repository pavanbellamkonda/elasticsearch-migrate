import type { SourceMigration, ExecutedMigration, MigrationContext, MigrateFn } from './models';

import path from 'path';
import fs from 'fs';
import { MigrationFileMissingError, MigrateFunctionImportFailedError, MigrationRunFailedError } from './errors';
import { updateLock } from './migration-lock';

export function validateExecutedMigrationsExist(executedMigrations: ExecutedMigration[], sourceMigrations: SourceMigration[]) {
  executedMigrations.forEach((existingMigration, index) => {
    const sourceMigration = sourceMigrations[index];
    if (
      !sourceMigration || 
      sourceMigration.position !== existingMigration.position ||
      sourceMigration.name !== existingMigration.name
    ) {
      throw new MigrationFileMissingError(existingMigration.name);
    }
  });
}

export function getPendingSourceMigrations(sourceMigrations: SourceMigration[], lastExecutedMigration: ExecutedMigration | null) {
  if (!lastExecutedMigration) {
    return sourceMigrations;
  }
  const pendingMigrations: SourceMigration[] = [];
  for (let i = sourceMigrations.length - 1; i >= 0; i--) {
    if (sourceMigrations[i].name === lastExecutedMigration.name) {
      break;
    }
    pendingMigrations.push(sourceMigrations[i]);
  }
  return pendingMigrations.reverse();
}

export async function fetchSourceMigrations(directory: string): Promise<SourceMigration[]> {
  const absoluteDir = path.resolve(process.cwd(), directory);
  const fileNames = await new Promise<string[]>((resolve, reject) => {
    fs.readdir(absoluteDir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
  fileNames.sort();
  return fileNames.map((name, position) => {
    const splitFileName = name.split('.');
    if (splitFileName.length > 1) {
      splitFileName.pop();
    }
    return {
      position,
      name,
      path: path.join(absoluteDir, splitFileName.join('.'))
    };
  });
}

export function importMigrateFunction(absoluteFilePath: string): MigrateFn {
  const fileImport = require(absoluteFilePath);
  if (typeof fileImport === 'object') {
    const migrateKey = 'migrate';
    const defaultKey = 'default';
    if (migrateKey in fileImport && isFunction(fileImport[migrateKey])) {
      return fileImport[migrateKey];
    }
    if (defaultKey in fileImport && isFunction(fileImport[defaultKey])) {
      return fileImport[defaultKey];
    }
  } else if (isFunction(fileImport)) {
    return fileImport;
  }
  throw new MigrateFunctionImportFailedError(absoluteFilePath);
}

export async function runMigrations(context: MigrationContext): Promise<MigrationContext> {
  const {
    pendingMigrations,
    client,
    indexName
  } = context;
  const lockIndexName = context.lockIndexName || indexName + '_lock';
  await updateLock({ client, lockIndexName, isLocked: true });
  const cleanup = async () => {
    await updateLock({ client, lockIndexName, isLocked: false });
    context.pendingMigrations = getPendingSourceMigrations(pendingMigrations, context.lastExecutedMigration);
  };
  try {
    for (const migration of pendingMigrations) {
      const migrateFn = importMigrateFunction(migration.path);
      try {
        await migrateFn({ client });
      } catch (err: any) {
        throw new MigrationRunFailedError(err.message, migration.name);
      }
      const executedMigration = {
        name: migration.name,
        position: migration.position,
        time: new Date().toISOString()
      };
      await client.index({
        index: indexName,
        id: String(migration.position),
        body: executedMigration
      });
      context.lastExecutedMigration = executedMigration;
    }
  } catch(err: any) {
    await cleanup();
    throw err;
  }
  await cleanup();
  return context;
}


export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}