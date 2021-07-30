import type { MigrationSource } from './models';
import path from 'path';
import fs from 'fs';
import { importMigrateFunction } from './import-migrate-function';

export async function fetchSourceMigrations(directory: string): Promise<MigrationSource[]> {
  const absoluteDir = path.join(process.cwd(), directory);
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
  const files = fileNames.map((fileName, index) => {
    const splitFileName = fileName.split('.');
    splitFileName.pop();
    return {
      id: index,
      fileName,
      path: path.join(absoluteDir, splitFileName.join('.'))
    };
  });
  return files.map(file => ({
    ...file,
    migrate: importMigrateFunction(file.path),
    skip: false
  }));
}
