import type { MigrationSource } from './models';
import path from 'path';
import fs from 'fs';
import { MigrateFunctionImportFailedError } from './errors';

export async function fetchSourceMigrations(directory: string): Promise<MigrationSource[]> {
  const absoluteDir = path.join(process.cwd(), directory)
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
    migrate: getMigrateFunction(file.path),
    skip: false
  }));
}

export function getMigrateFunction(absoluteFilePath: string) {
  const fileImport = require(absoluteFilePath);
  if (typeof fileImport === 'object') {
    if ('migrate' in fileImport && typeof fileImport['migrate'] === 'function') {
      return fileImport['migrate'];
    }
    if ('default' in fileImport && typeof fileImport['default'] === 'function') {
      return fileImport['default'];    
    }
  } else if (typeof fileImport === 'function') {
    return fileImport;
  }
  throw new MigrateFunctionImportFailedError(absoluteFilePath);
}