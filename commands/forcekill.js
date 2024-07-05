import { SlashCommandBuilder } from "discord.js";

import { JSONManager } from "../modules/JSONManager.js";
import { sleep } from "../modules/sleep.js";

const config = new JSONManager("./config.json").get();

export default {
  // 명령어 설정
  data: new SlashCommandBuilder().setName("forcekill").setDescription("봇 종료"),

  async execute(interaction, client) {
    if (interaction.member.id === config.ownerId) {
      await interaction.reply("프로세스 종료");
      await sleep(1);
      process.exit(27);
    } else {
      await interaction.reply("넌 안돼");
    }
  },
};
