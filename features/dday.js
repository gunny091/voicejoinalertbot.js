import { Events, Collection } from "discord.js";

import { findChannel } from "../modules/findChannel.js";
import { replaceAll } from "../modules/replaceAll.js";
import { JSONManager } from "../modules/JSONManager.js";

const config = new JSONManager("./config.json").get();

async function checkDDay(client) {
  const date = new Date();
  if (
    date.getHours() == config.dday.hour &&
    date.getMinutes() == config.dday.minute
  ) {
    const channel = await findChannel(client, config.dday.channel);
    if (channel) {
      const today = new Date();
      const DDay = new Date(config.dday.startDate);
      const timeGap = today.getTime() - DDay.getTime();
      const result =
        Math.floor(timeGap / (1000 * 60 * 60 * 24)) +
        (config.dday.includeFirstDay ? 1 : 0);

      const filter = new Collection();
      filter.set("{dday}", String(result));
      filter.set("{everyone}", "@everyone");
      (await channel.send(replaceAll(config.dday.message, filter))).react(
        config.dday.react
      );
    }
  }
}
export default function install(client) {
  client.once(Events.ClientReady, () => {
    if (config.dday) {
      checkDDay(client);
      setInterval(() => checkDDay(client), 60 * 1000);
    }
  });
}
