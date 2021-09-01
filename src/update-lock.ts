import type { Client } from '@elastic/elasticsearch';

export async function updateLock({
  client,
  lockIndexName,
  isLocked,
}: {
  client: Client;
  lockIndexName: string;
  isLocked: boolean;
}) {
  await client.index({
    index: lockIndexName,
    id: 'lock',
    body: {
      isLocked,
    },
  });
}
