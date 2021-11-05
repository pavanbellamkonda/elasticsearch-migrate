import { ExecutedMigration, MigrationContext, SourceMigration } from '../src/models';
import {
  fetchSourceMigrations,
  getPendingSourceMigrations,
  validateExecutedMigrationsExist,
  importMigrateFunction,
  isFunction,
  executeMigrations
} from '../src/source-migrations';
import { client } from './client';

describe('fetchSourceMigrations()', () => {
  it('fetches existing filenames given in migration directory', async () => {
    const directory = __dirname + '/es-migrations'
    const sourceFileNames = await fetchSourceMigrations(directory);
    expect(sourceFileNames).toEqual([
      {
        position: 0,
        name: '01-create-index.ts',
        path: __dirname + '/es-migrations/01-create-index.ts'
      },
      {
        position: 1,
        name: '02-update-schema.ts',
        path: __dirname + '/es-migrations/02-update-schema.ts'
      },
      {
        position: 2,
        name: '03-update-again.ts',
        path: __dirname + '/es-migrations/03-update-again.ts'
      },
      {
        position: 3,
        name: '04-update-4.ts',
        path: __dirname + '/es-migrations/04-update-4.ts'
      }
    ])
  });
});

describe('validateExecutedMigrationsExist()', () => {
  it('returns nothing if all executed migrations exist in source migrations in the same order', () => {
    const sourceMigrations: SourceMigration[] = [
      {
        position: 0,
        name: '01-file.ts',
        path: ''
      },
      {
        position: 1,
        name: '02-file.ts',
        path: ''
      }
    ];
    const executedMigrations: ExecutedMigration[] = [
      {
        position: 0,
        name: '01-file.ts',
        time: ''
      },
      {
        position: 1,
        name: '02-file.ts',
        time: ''
      }
    ];
    try {
      validateExecutedMigrationsExist(executedMigrations, sourceMigrations);
    } catch(err:any) {
      fail('executed migrations validation failed');
    }
  });

  it('throws MigrationFileMissingError if an executed migration is missing in source migrations', () => {
    const sourceMigrations: SourceMigration[] = [
      {
        position: 0,
        name: '01-file.ts',
        path: ''
      },
      {
        position: 2,
        name: '03-file.ts',
        path: ''
      }
    ];
    const executedMigrations: ExecutedMigration[] = [
      {
        position: 0,
        name: '01-file.ts',
        time: ''
      },
      {
        position: 1,
        name: '02-file.ts',
        time: ''
      }
    ];
    try {
      validateExecutedMigrationsExist(executedMigrations, sourceMigrations);
    } catch(err: any) {
      expect(err.message).toEqual('MigrationFileMissingError: 02-file.ts is missing in the directory.');
    }
  });
});

describe('getPendingSourceMigrations()', () => {
  it('returns pending migrations based on lastExecutedMigration - lastExecutedMigration FOUND', () => {
    const sourceMigrations: SourceMigration[] = [
      {
        position: 0,
        name: '01-file.ts',
        path: ''
      },
      {
        position: 1,
        name: '02-file.ts',
        path: ''
      },
      {
        position: 2,
        name: '03-file.ts',
        path: ''
      }
    ];
    const lastExecutedMigration: ExecutedMigration = {
      position: 0,
      name: '01-file.ts',
      time: ''
    };

    expect(getPendingSourceMigrations(sourceMigrations, lastExecutedMigration)).toEqual([
      {
        position: 1,
        name: '02-file.ts',
        path: ''
      },
      {
        position: 2,
        name: '03-file.ts',
        path: ''
      }
    ])
  });

  it('returns pending migrations based on lastExecutedMigration - lastExecutedMigration NOT FOUND or null', () => {
    const sourceMigrations: SourceMigration[] = [
      {
        position: 0,
        name: '01-file.ts',
        path: ''
      },
      {
        position: 1,
        name: '02-file.ts',
        path: ''
      },
      {
        position: 2,
        name: '03-file.ts',
        path: ''
      }
    ];
    const lastExecutedMigration: ExecutedMigration = {
      position: 5,
      name: '05-file.ts',
      time: ''
    };

    expect(getPendingSourceMigrations(sourceMigrations, lastExecutedMigration)).toEqual(sourceMigrations)
    expect(getPendingSourceMigrations(sourceMigrations, null)).toEqual(sourceMigrations)
  });
});

describe('importMigrateFunction() - imports migrate function from absoluteFilePath', () => {
  it('handles exports.migrate = function', () => {
    const path =__dirname + '/es-migrations/03-update-again';
    const migrateFn = importMigrateFunction(path);
    expect(typeof migrateFn).toEqual('function');
    expect(migrateFn.name).toEqual('migrate');
  });

  it('handles module.exports = migrate', () => {
    const path = __dirname + '/es-migrations/01-create-index';
    const migrateFn = importMigrateFunction(path);
    expect(typeof migrateFn).toEqual('function');
    expect(migrateFn.name).toEqual('migrate');
  });

  it('handles named exports - export async function migrate() {}', () => {
    const path = __dirname + '/es-migrations/02-update-schema';
    const migrateFn: Function = importMigrateFunction(path);
    expect(typeof migrateFn).toEqual('function');
    expect(migrateFn.name).toEqual('migrate');
  });

  it('handles default exports - export default async function migrate() {}', () => {
    const path = __dirname + '/es-migrations/04-update-4';
    const migrateFn: Function = importMigrateFunction(path);
    expect(typeof migrateFn).toEqual('function');
    expect(migrateFn.name).toEqual('migrate');
  });
});

describe('isFunction()', () => {
  it('returns true if function is passed', () => {
    expect(isFunction(() => {})).toEqual(true);
    expect(isFunction(async () => {})).toEqual(true);
  });

  it('returns false if passed value is not function', () => {
    expect(isFunction(null)).toEqual(false);
    expect(isFunction({})).toEqual(false);//@ts-ignore
    expect(isFunction()).toEqual(false);
  });
});

describe('executeMigrations() - runs pending migrations', () => {
  it('locks migration and runs migrations - HAPPY PATH', async () => {
    await client.indices.delete({
      index: String(process.env.indexName),
      ignore_unavailable: true
    });
    const pendingMigrations = [
      {
        position: 0,
        name: '01-create-index.ts',
        path: __dirname + '/es-migrations/01-create-index'
      },
      {
        position: 1,
        name: '02-update-schema.ts',
        path: __dirname + '/es-migrations/02-update-schema'
      },
      {
        position: 2,
        name: '03-update-again.ts',
        path: __dirname + '/es-migrations/03-update-again'
      },
      {
        position: 3,
        name: '04-update-4.ts',
        path: __dirname + '/es-migrations/04-update-4'
      }
    ];
    const indexName = 'run_migrations_happy';
    const lockIndexName = indexName + '_lock';
    let context = { indexName, pendingMigrations, lockIndexName, client } as MigrationContext;
    context = await executeMigrations(context);
    expect(context.lastExecutedMigration?.position).toEqual(3);
    expect(context.lastExecutedMigration?.name).toEqual('04-update-4.ts');
    expect(context.pendingMigrations).toEqual([]);
  });
});