import { MigrateFnInput } from '../../src/models';

async function migrate({client}: MigrateFnInput) {
  console.log('01-create-index')
  await client.indices.create({
    index: String(process.env.indexName),
    body: {
      mappings: {
        properties: {
          username: {
            type: 'text'
          }
        }
      }
    }
  })
}

module.exports = migrate;