import type { Client } from '@elastic/elasticsearch';

export async function createIndexIfNotAvailable({
  client,
  indexName,
  schema,
}: {
  indexName: string;
  client: Client;
  schema: { properties: any };
}): Promise<{ created: boolean }> {
  const { body: indexExists } = await client.indices.exists({
    index: indexName,
  });
  if (!indexExists) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: schema
      }
    });
  }
  return { created: !indexExists };
}
