import type { MigrationRecord, MigrationSource } from './models';

import { MigrationFileMissingError } from './errors';

export function getPendingMigrations(sourceMigrations: MigrationSource[], existingMigrations: MigrationRecord[]) {
  existingMigrations.forEach((existingMigration, index) => {
    const sourceMigration = sourceMigrations[index];
    if (!sourceMigration) {
      throw new MigrationFileMissingError(existingMigration.name);
    }
    if (sourceMigration.id === existingMigration.id && sourceMigration.fileName === existingMigration.name) {
      sourceMigration.skip = true;
    } else {
      throw new MigrationFileMissingError(existingMigration.name);
    }
  });
  return sourceMigrations;
}