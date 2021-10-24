import { Client } from '@elastic/elasticsearch';

export const client = new Client({
  node: `http://${process.env.ES_HOST || 'localhost'}:9200`
});
