import { MigrateFunctionImportFailedError, MigrationLockTimedOutError, MigrationFileMissingError, MigrationRunFailedError } from '../src/errors';

describe('MigrateFunctionImportFailedError', () => {
  it('throws error with import migrate function failed message', () => {
    const filePath = '/code/src/migtations/01-file.ts';
    try {
      throw new MigrateFunctionImportFailedError(filePath);
    } catch(err:any) {
      expect(err.message).toEqual('MigrateFunctionImportFailedError: Error importing migrate function from file:\n ' + filePath);
    }
  });
});

describe('MigrationFileMissingError', () => {
  it('throws error with migration file missing present in migration index', () => {
    const name = '01-file.ts';
    try {
      throw new MigrationFileMissingError(name);
    } catch(err: any) {
      expect(err.message).toEqual(`MigrationFileMissingError: ${name} is missing in the directory.`);
    }
  });
});

describe('MigrationRunFailedError', () => {
  it('throws error with the error message from migrate function`s error', () => {
    const name = '01-file.ts';
    let errorMessage;
    try {
      try {
        throw new Error('Some Error');
      } catch (e: any) {
        errorMessage = e.message;
        throw new MigrationRunFailedError(errorMessage, name);
      }
    } catch(err:any) {
      expect(err.message).toEqual(`MigrationRunFailedError: Error running migration in ${name} file: ${errorMessage}`);
    }
  });
});

describe('MigrationLockTimedOutError', () => {
  it('throws error when migration lock times out', () => {
    const timeOutMs = 10000;
    try {
      throw new MigrationLockTimedOutError(timeOutMs);
    } catch(err:any) {
      expect(err.message).toEqual('MigrationLockTimedOutError: Migration Lock is not released before timeout 10 seconds');
    }
  });
});