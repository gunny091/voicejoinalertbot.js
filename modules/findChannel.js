export async function findChannel(client, Id) {
  try {
    const channel = await client.channels.fetch(Id);
    return channel;
  } catch (e) {
    return null;
  }
}
