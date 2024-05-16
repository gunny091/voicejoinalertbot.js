import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test command"),
  async execute(interaction) {
    await interaction.reply("ㅇㅉ");
  },
};
