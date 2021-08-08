export class MigrationLockTimedOutError extends Error {
  constructor(timeOutMs: number) {
    super(`MigrationLockTimedOutError: Migration Lock is not released before timeout ${timeOutMs/1000} seconds`);
  }
}