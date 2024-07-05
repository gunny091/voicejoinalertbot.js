import { SlashCommandBuilder } from "discord.js";

import { JSONManager } from "../modules/JSONManager.js";
import { sleep } from "../modules/sleep.js";

const config = new JSONManager("./config.json").get();

export default {
  // 명령어 설정
  data: new SlashCommandBuilder().setName("reload").setDescription("봇 리로드"),

  async execute(interaction, client) {
    if (config.ownerId.includes(interaction.member.id)) {
      await interaction.reply("봇 리로드");
      await sleep(100);
      process.exit();
    } else {
      await interaction.reply("넌 안돼");
    }
  },
};
