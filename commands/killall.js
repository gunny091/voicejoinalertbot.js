import { SlashCommandBuilder } from "discord.js";
import { sleep } from "../modules/sleep.js";

async function killall(channel) {
  return (
    await Promise.allSettled(Array.from(channel.members.values()).map((member) => member.voice.disconnect()))
  ).every((result) => result.status === "fulfilled");
}

function lateLog({ startTime, minutes, displayName, message }) {
  return `${startTime} +${minutes}m
${displayName}: ${message}`;
}

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
        if (await killall(interaction.member.voice.channel)) {
          await interaction.reply("처리 완료");
        } else {
          await interaction.reply("실패");
        }
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
      const startTime = new Date().toString();
      const messageInfo = { startTime, minutes, displayName: interaction.member.displayName };
      client.data.killallRunningPid = pid;

      await sleep((minutes - 1) * 60 * 1000);

      // 1분전
      if (pid == client.data.killallRunningPid) {
        if (interaction.member.voice.channel) {
          await interaction.channel.send(lateLog({ ...messageInfo, message: "1분 전" }));
        } else {
          await interaction.channel.send(
            lateLog({
              ...messageInfo,
              message: "통방에 있어야 ㄱㄴ, 취소됨",
            })
          );
          client.data.killallRunningPid = -1;
          return;
        }
      }

      await sleep(60 * 1000);

      // 취소아님
      if (pid == client.data.killallRunningPid) {
        client.data.killallRunningPid = -1;
        if (interaction.member.voice.channel) {
          // 다 연결 끊기
          if (await killall(interaction.member.voice.channel)) {
            await interaction.channel.send(lateLog({ ...messageInfo, message: "처리 완료" }));
          } else {
            await interaction.channel.send(lateLog({ ...messageInfo, message: "실패" }));
          }
        }
      }
      // 취소됨
      else {
        await interaction.channel.send(lateLog({ ...messageInfo, message: "취소됨" }));
      }
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
