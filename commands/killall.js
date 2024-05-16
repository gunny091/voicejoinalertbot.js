import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("killall")
    .setDescription("보이스에 있는사람 다 뒤지는거야"),
  async execute(interaction) {
    if (interaction.member.voice.channel) {
      for (const member of interaction.member.voice.channel.members.values()) {
        await member.voice.disconnect();
      }
      await interaction.reply("처리 완료");
    } else {
      await interaction.reply("통방에 있어야 ㄱㄴ");
    }
  },
};
