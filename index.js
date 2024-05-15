import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

import { JSONManager } from "./modules/JSONManager.js";

const config = new JSONManager("./config.json").get();

import dday from "./features/dday.js";
import voicealert from "./features/voicealert.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

dday(client);
voicealert(client);

client.login(config.token);
