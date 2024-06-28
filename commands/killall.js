import { SlashCommandBuilder } from "discord.js";
import { sleep } from "../modules/sleep.js";

export default {
  // 명령어 설정
  data: new SlashCommandBuilder()
    .setName("killall")
    .setDescription("보이스에 있는사람 다 뒤지는거야")
    .addSubcommand((subcommand) => subcommand.setName("rightnow").setDescription("지금당장"))
    .addSubcommand((subcommand) => subcommand.setName("cancel").setDescription("취소"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("wait")
        .setDescription("기다리기")
        .addIntegerOption((option) =>
          option.setName("minutes").setDescription("분 단위로 입력").setMinValue(1).setMaxValue(300).setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const subcmd = interaction.options.getSubcommand();
    // 즉시 실행
    if (subcmd === "rightnow") {
      if (interaction.member.voice.channel) {
        for (const member of interaction.member.voice.channel.members.values()) {
          await member.voice.disconnect();
        }
        await interaction.reply("처리 완료");
      } else {
        await interaction.reply({ content: "통방에 있어야 ㄱㄴ", ephemeral: true });
      }
      client.data.killallRunningPid = -1;
    }

    // 지연 실행
    if (subcmd === "wait") {
      const minutes = interaction.options.getInteger("minutes", true);

      await interaction.reply(`${minutes}분만 ㄱㄷ`);

      const pid = new Date().getTime();
      client.data.killallRunningPid = pid;

      await sleep(minutes * 60 * 1000);

      let message = `(${interaction.member.displayName}:${interaction.toString()}) `;

      // 취소아님
      if (pid == client.data.killallRunningPid) {
        if (interaction.member.voice.channel) {
          // 다 연결 끊기
          for (const member of interaction.member.voice.channel.members.values()) {
            await member.voice.disconnect();
          }
          await interaction.channel.send(`${interaction.member.displayName} 늦게 처리 완료`);
        }
      }
      client.data.killallRunningPid = -1;
    }

    // 취소
    if (subcmd === "cancel") {
      if (client.data.killallRunningPid && client.data.killallRunningPid != -1) {
        client.data.killallRunningPid = -1;
        await interaction.reply("취소.");
      } else {
        await interaction.reply("취소할게 없어요;");
      }
      return;
    }
  },
};
