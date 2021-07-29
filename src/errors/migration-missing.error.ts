export class MigrationFileMissingError extends Error {
  constructor(fileName: string) {
    super(fileName + ' is missing in the directory.');
  }
}