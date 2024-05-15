import { Events, Collection } from "discord.js";

import { replaceAll } from "../modules/replaceAll.js";
import { findChannel } from "../modules/findChannel.js";
import { JSONManager } from "../modules/JSONManager.js";

const config = new JSONManager("./config.json").get().voicealert;

export default function install(client) {
  client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    try {
      if (!newState.channel) return;
      if (oldState.channelId == newState.channelId) return;

      if (!config.targets.includes(newState.channelId)) return;

      if (newState.channel.members.size != 1) return;

      const alertChannel = await findChannel(client, config.alert);
      if (!alertChannel) return;
      const user = newState.member;
      const channel = newState.channel;

      const filter = new Collection();
      filter.set("{username}", user.displayName);
      filter.set("{channel}", channel.toString());
      filter.set("{everyone}", "@everyone");

      alertChannel.send(replaceAll(config.message, filter));
    } catch (e) {
      console.error(e);
    }
  });
}
