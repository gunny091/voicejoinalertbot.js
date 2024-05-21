import { Events, Collection } from "discord.js";

import { replaceAll } from "../modules/replaceAll.js";
import { findChannel } from "../modules/findChannel.js";
import { JSONManager } from "../modules/JSONManager.js";

const config = new JSONManager("./config.json").get().voicealert;

export default function install(client) {
  client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    try {
      // 음성 채널에 접속했을 때 채널의 총 인원이 1명일 때만 실행
      if (!newState.channel) return;
      if (oldState.channel) return;
      if (oldState.channelId == newState.channelId) return;

      if (!config.targets.includes(newState.channelId)) return;

      if (newState.channel.members.size != 1) return;

      // 알림 보낼 채널
      const alertChannel = await findChannel(client, config.alert);
      if (!alertChannel) return;
      const user = newState.member;
      const channel = newState.channel;

      // 필터링
      const filter = new Collection();
      filter.set("{username}", user.displayName);
      filter.set("{usermention}", user.toString());
      filter.set("{channel}", channel.toString());
      filter.set("{everyone}", "@everyone");

      // 알림 보내기
      alertChannel.send(replaceAll(config.message, filter));
    } catch (e) {
      console.error(e);
    }
  });
}
