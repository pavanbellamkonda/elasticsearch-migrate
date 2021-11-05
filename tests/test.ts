import isReachable from 'is-reachable';
import Jasmine from 'jasmine';

const jasmine = new Jasmine({});

jasmine.loadConfigFile('tests/jasmine.json');
process.env.indexName = 'my_index';
async function waitForElasticsarch() {
  const esHost = `http://${process.env.ES_HOST || 'localhost'}:9200`;
  console.log(esHost)
  let isUp = await isReachable(esHost);
  while(!isUp) {
    isUp = await isReachable(esHost);
    await new Promise(res => setTimeout(res, 1000));
  }
  jasmine.execute();
}
waitForElasticsarch();