import { MigrateFunctionImportFailedError } from '../../src/errors';

describe('MigrateFunctionImportFailedError', () => {
  it('throws error with import migrate function failed message', () => {
    const filePath = '/code/src/migtations/01-file.ts';
    try {
      throw new MigrateFunctionImportFailedError(filePath);
    } catch(err) {
      expect(err.message).toEqual('MigrateFunctionImportFailedError: Error importing migrate function from file:\n ' + filePath);
    }
  });
});