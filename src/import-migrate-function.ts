import { MigrateFunctionImportFailedError } from './errors';
import { isFunction } from './utils';

export function importMigrateFunction(absoluteFilePath: string) {
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