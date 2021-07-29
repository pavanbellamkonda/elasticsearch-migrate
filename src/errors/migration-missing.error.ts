export class MigrationFileMissingError extends Error {
  constructor(fileName: string) {
    super(`MigrationFileMissingError: ${fileName} is missing in the directory.`);
  }
}