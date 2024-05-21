// 채널 Id로 채널을 찾아줌
export async function findChannel(client, Id) {
  try {
    const channel = await client.channels.fetch(Id);
    return channel;
  } catch (e) {
    return null;
  }
}
