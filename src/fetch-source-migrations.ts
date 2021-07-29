import path from 'path';
import fs from 'fs';
import type { Client } from '@elastic/elasticsearch';

type MigrationSource = {
  migrate: (client: Client) => Promise<void>
}

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
  const filePaths = fileNames.map(fileName => {
    const splitFileName = fileName.split('.');
    splitFileName.pop();
    return path.join(absoluteDir, splitFileName.join('.'));
  });
  return filePaths.map(filePath => require(filePath));
}