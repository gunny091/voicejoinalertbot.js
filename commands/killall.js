import { SlashCommandBuilder } from "discord.js";
import { sleep } from "../modules/sleep.js";

export default {
  // 명령어 설정
  data: new SlashCommandBuilder()
    .setName("killall")
    .setDescription("보이스에 있는사람 다 뒤지는거야")
    .addIntegerOption((option) =>
      option.setName("wait").setDescription("분으로 입력하세요").setMinValue(0).setMaxValue(300)
    )
    .addBooleanOption((option) => option.setName("cancel").setDescription("True: 취소")),
  async execute(interaction) {
    // 취소
    const cancel = interaction.options.getBoolean("cancel", false);
    if (cancel) {
      if (interaction.client.data.killallRunningPid && interaction.client.data.killallRunningPid != -1) {
        interaction.client.data.killallRunningPid = -1;
        await interaction.reply("취소됨");
      } else {
        await interaction.reply("취소할게 없어요");
      }
      return;
    }

    // 지연 실행
    const minutes = interaction.options.getInteger("wait", false);

    // 즉시 실행
    if (minutes == 0 || minutes == null) {
      if (interaction.member.voice.channel) {
        for (const member of interaction.member.voice.channel.members.values()) {
          await member.voice.disconnect();
        }
        await interaction.reply("처리 완료");
      } else {
        await interaction.reply("통방에 있어야 ㄱㄴ");
      }
    }
    // 지연 실행
    else {
      interaction.reply(`${minutes}분만 ㄱㄷ`);

      const pid = new Date().getTime();
      interaction.client.data.killallRunningPid = pid;

      await sleep(minutes * 60 * 1000);

      let message = `(${interaction.member.displayName}:${interaction.toString()}) `;

      // 취소아님
      if (pid == interaction.client.data.killallRunningPid) {
        if (interaction.member.voice.channel) {
          // 다 연결 끊기
          for (const member of interaction.member.voice.channel.members.values()) {
            await member.voice.disconnect();
          }
          message += "처리 완료";
        }
        // 아무도 없을 때
        else {
          message += "통방에 있어야 ㄱㄴ";
        }
      }
      // 취소
      else {
        message += "취소되거나 덮여쓰여짐";
      }
      interaction.client.data.killallRunningPid = -1;
      await interaction.channel.send(message);
    }
  },
};
