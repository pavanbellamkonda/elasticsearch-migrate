import { MigrateFnInput } from '../../src/models';

async function migrate({client}: MigrateFnInput) {
  console.log('03-update-again')
  await client.indices.putMapping({
    index: String(process.env.indexName),
    body: {
      properties: {
        lastname: {
          type: 'keyword'
        }
      }
    }
  });
}

exports.migrate = migrate;