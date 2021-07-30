import { MigrationFileMissingError } from '../../src/errors';

describe('MigrationFileMissingError', () => {
  it('throws error with migration file missing present in migration index', () => {
    const fileName = '01-file.ts';
    try {
      throw new MigrationFileMissingError(fileName);
    } catch(err) {
      expect(err.message).toEqual(`MigrationFileMissingError: ${fileName} is missing in the directory.`);
    }
  });
});