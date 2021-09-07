import type { Client } from '@elastic/elasticsearch';

async function migrate(client: Client) {
  await client.indices.create({
    index: 'my_index',
    // body: {

    // }
  })
}

module.exports = migrate;