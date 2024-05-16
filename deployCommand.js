import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { REST, Routes } from "discord.js";

import { JSONManager } from "./modules/JSONManager.js";

const { token, clientId } = new JSONManager("./config.json").get();

(async () => {
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const { default: command } = await import("file:///" + filePath);
      commands.push(command.data.toJSON());
    } catch (err) {
      console.error(err);
    }
  }

  const rest = new REST().setToken(token);
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
