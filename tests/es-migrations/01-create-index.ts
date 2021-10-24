import { MigrateFnInput } from '../../src/models';

async function migrate({client}: MigrateFnInput) {
  await client.indices.create({
    index: 'my_index',
    // body: {

    // }
  })
}

module.exports = migrate;