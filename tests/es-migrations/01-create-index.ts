import { MigrateFnInput } from '../../src/models';

async function migrate({client}: MigrateFnInput) {
  console.log('01-create-index')
  // await client.indices.create({
  //   index: 'my_index',
  //   // body: {

  //   // }
  // })
}

module.exports = migrate;