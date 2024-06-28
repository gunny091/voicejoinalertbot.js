import { ChannelType, SlashCommandBuilder } from "discord.js";

function reminderToString(v, k) {
  return `(${k}) ${new Date(k).toLocaleString()} | ${v.memberDisplayName}:<#${v.channel}> | \`${v.message}\``;
}

export default {
  // 명령어 설정
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("어차피 까먹을거잖아 걍 써")
    // add: channel, message, datetime
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("추가")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("보낼 채널").setRequired(true).addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) => option.setName("message").setDescription("뭐보내줄까").setRequired(true))
        .addStringOption((option) =>
          option.setName("datetime").setDescription("언제? ex) 2024/1/1 1:23:45").setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("목록"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("삭제")
        .addIntegerOption((option) =>
          option.setName("timecode").setDescription("모르겠으면 리스트 봐").setMinValue(0).setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const subcmd = interaction.options.getSubcommand();
    // 추가
    if (subcmd === "add") {
      const datetime = new Date(interaction.options.getString("datetime"));
      // 시간이 아닐 때
      if (isNaN(datetime.getTime())) {
        await interaction.reply({ content: "그....저기.....시간이.....이상해", ephemeral: true });
        return;
      }
      // 시간이 겹칠 때
      if (client.data.reminders.has(datetime.getTime())) {
        await interaction.reply({ content: "ㅈㅅ 시간이 겹침", ephemeral: true });
        return;
      }
      // 컬렉션에 추가
      client.data.reminders.set(datetime.getTime(), {
        channel: interaction.options.getChannel("channel").id,
        message: interaction.options.getString("message"),
        member: interaction.member.toString(),
        memberDisplayName: interaction.member.displayName,
      });
      await interaction.reply("추가.");
    }

    // 목록
    if (subcmd === "list") {
      let text = "";
      // 한줄 씩 추가
      client.data.reminders.each((v, k) => {
        text += "\n";
        text += reminderToString(v, k);
      });
      // 제목 추가
      if (!text) {
        text = "리마인더 없음";
      } else {
        text = "# 리마인더" + text;
      }
      // 나한테만 보기로 응답
      await interaction.reply({
        content: text,
        ephemeral: true,
      });
    }
    // 삭제
    if (subcmd === "remove") {
      const timecode = interaction.options.getInteger("timecode");
      if (client.data.reminders.has(timecode)) {
        const v = client.data.reminders.get(timecode);
        client.data.reminders.delete(timecode);
        await interaction.reply(`삭제.\n${reminderToString(v, timecode)}`);
      } else {
        await interaction.reply({
          content: "리마인더가 없어 코드 다시 찾아봐",
          ephemeral: true,
        });
      }
    }
    // 리마인더 저장
    client.data.reminderCheck(client);
  },
};
