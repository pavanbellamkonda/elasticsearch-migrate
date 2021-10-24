export class MigrateFunctionImportFailedError extends Error {
  constructor(filePath: string) {
    super('MigrateFunctionImportFailedError: Error importing migrate function from file:\n ' + filePath);
  }
}

export class MigrationLockTimedOutError extends Error {
  constructor(timeOutMs: number) {
    super(`MigrationLockTimedOutError: Migration Lock is not released before timeout ${timeOutMs/1000} seconds`);
  }
}

export class MigrationFileMissingError extends Error {
  constructor(name: string) {
    super(`MigrationFileMissingError: ${name} is missing in the directory.`);
  }
}

export class MigrationRunFailedError extends Error {
  constructor(errorMessage: string, name: string) {
    super(`MigrationRunFailedError: Error running migration in ${name} file: ${errorMessage}`);
  }
}