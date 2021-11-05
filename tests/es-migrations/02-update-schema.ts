import { MigrateFnInput } from '../../src/models';

export async function migrate({client}: MigrateFnInput) {
  console.log('02-update-schema')
  await client.indices.putMapping({
    index: String(process.env.indexName),
    body: {
      properties: {
        name: {
          type: 'text',
        }
      }
    }
  });
}
