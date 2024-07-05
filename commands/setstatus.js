import { SlashCommandBuilder, ActivityType } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("상태설정")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("상태")
        .setRequired(true)
        .addChoices({ name: "online", value: "online" }, { name: "idle", value: "idle" }, { name: "dnd", value: "dnd" })
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("상태메시지").setRequired(false).setMaxLength(20)
    ),

  async execute(interaction, client) {
    if (interaction.options.getString("message")) {
      client.user.setPresence({
        activities: [{ name: interaction.options.getString("message"), type: ActivityType.Custom }],
        status: interaction.options.getString("status"),
      });
    } else {
      client.user.setPresence({
        activities: [{ name: " ", type: ActivityType.Custom }],
        status: interaction.options.getString("status"),
      });
    }
    await interaction.reply("설정끝");
  },
};
