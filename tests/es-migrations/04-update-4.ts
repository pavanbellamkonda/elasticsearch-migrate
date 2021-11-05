import { MigrateFnInput } from '../../src/models';

async function migrate({client}: MigrateFnInput) {
  console.log('04-update-4')
  await client.indices.putMapping({
    index: String(process.env.indexName),
    body: {
      properties: {
        firstName: {
          type: 'keyword'
        }
      }
    }
  });
}

export default migrate;