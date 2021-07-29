import { fetchExistingMigrations } from './fetch-existing-migrations';
import type { MigrationRecord } from './migration-record.model';
import type { MigrationConfig } from './migration-config.model';

export async function migrate({ indexName, directory, client }: MigrationConfig): Promise<void> {
  const { body: migrationIndexExists } = await client.indices.exists({
    index: indexName
  });
  let existingMigrations: MigrationRecord[] = [];
  if (!migrationIndexExists) {
    await client.indices.create({
      index: indexName
    });
  } else {
    existingMigrations = await fetchExistingMigrations({ indexName, client });
  }
}