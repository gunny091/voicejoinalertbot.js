import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("name").setDescription("description"),

  async execute(interaction, client) {},
};
