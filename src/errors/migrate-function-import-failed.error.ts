export class MigrateFunctionImportFailedError extends Error {
  constructor(filePath: string) {
    super('MigrateFunctionImportFailedError: Error importing migrate function from file:\n ' + filePath);
  }
}