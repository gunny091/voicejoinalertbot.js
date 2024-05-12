import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./config.json");

import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

async function findChannel(Id) {
  try {
    const channel = await client.channels.fetch(Id);
    return channel;
  } catch (e) {
    return null;
  }
}

function replaceAll(str, filter) {
  let newStr = str;
  for (const key of filter.keys()) {
    newStr = newStr.split(key).join(filter.get(key));
  }
  return newStr;
}

async function checkDDay() {
  const date = new Date();
  if (
    date.getHours() == config.dday.hour &&
    date.getMinutes() == config.dday.minute
  ) {
    const channel = await findChannel(config.dday.channel);
    if (channel) {
      const today = new Date();
      const DDay = new Date(config.dday.startDate);
      const timeGap = today.getTime() - DDay.getTime();
      const result =
        Math.floor(timeGap / (1000 * 60 * 60 * 24)) +
        (config.dday.includeFirstDay ? 1 : 0);

      const filter = new Collection();
      filter.set("{dday}", String(result));
      channel.send(replaceAll(config.dday.message, filter));
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  if (config.dday) setInterval(checkDDay, 60 * 1000);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (!newState.channel) return;
    if (oldState.channelId == newState.channelId) return;

    const configguild = config.guilds[newState.guild.id];
    if (!configguild) return;
    if (!configguild.targets.includes(newState.channelId)) return;

    if (newState.channel.members.size != 1) return;

    const alertChannel = await findChannel(configguild.alert);
    if (!alertChannel) return;
    const user = newState.member;
    const channel = newState.channel;

    const filter = new Collection();
    filter.set("{username}", user.displayName);
    filter.set("{channel}", channel.toString());
    filter.set("{everyone}", "@everyone");

    alertChannel.send(replaceAll(configguild.message, filter));
  } catch (e) {
    console.error(e);
  }
});

client.login(config.token);
