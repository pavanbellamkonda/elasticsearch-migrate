export class MigrationRunFailedError extends Error {
  constructor(errorMessage: string, fileName: string) {
    super(`Error running migration in ${fileName} file:\n ${errorMessage}`);
  }
}