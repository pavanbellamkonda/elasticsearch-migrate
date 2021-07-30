import { MigrationRunFailedError } from '../../src/errors';

describe('MigrationRunFailedError', () => {
  it('throws error with the error message from migrate function`s error', () => {
    const fileName = '01-file.ts';
    let errorMessage;
    try {
      try {
        throw new Error('Some Error');
      } catch (e) {
        errorMessage = e.message;
        throw new MigrationRunFailedError(errorMessage, fileName);
      }
    } catch(err) {
      expect(err.message).toEqual(`MigrationRunFailedError: Error running migration in ${fileName} file:\n ${errorMessage}`);
    }
  });
});