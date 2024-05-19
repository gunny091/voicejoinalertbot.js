import { SlashCommandBuilder } from "discord.js";
import { sleep } from "../modules/sleep.js";

export default {
  data: new SlashCommandBuilder()
    .setName("killall")
    .setDescription("보이스에 있는사람 다 뒤지는거야")
    .addIntegerOption((option) =>
      option
        .setName("wait")
        .setDescription("분으로 입력하세요")
        .setMinValue(0)
        .setMaxValue(300)
    ),
  async execute(interaction) {
    const minutes = interaction.options.getInteger("wait", false);
    if (minutes == 0 || minutes == null) {
      if (interaction.member.voice.channel) {
        for (const member of interaction.member.voice.channel.members.values()) {
          await member.voice.disconnect();
        }
        await interaction.reply("처리 완료");
      } else {
        await interaction.reply("통방에 있어야 ㄱㄴ");
      }
    } else {
      interaction.reply(`${minutes}분만 ㄱㄷ`);
      await sleep(minutes * 60 * 1000);
      if (interaction.member.voice.channel) {
        for (const member of interaction.member.voice.channel.members.values()) {
          await member.voice.disconnect();
        }
        await interaction.channel.send("처리 완료");
      } else {
        await interaction.channel.send("통방에 있어야 ㄱㄴ");
      }
    }
  },
};
