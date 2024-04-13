const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Returns a button"),
  async execute(interaction, client) {
    const button1 = new ButtonBuilder()
        .setCustomId('sub-yt-auri')
        .setLabel(`Auri's Channel`)
        .setStyle(ButtonStyle.Primary);
    const button2 = new ButtonBuilder()
        .setCustomId('sub-yt-swannc')
        .setLabel(`Swan NC's Channel`)
        .setStyle(ButtonStyle.Primary);

    await interaction.reply({
        components: [new ActionRowBuilder().addComponents(button1, button2)]
    });
  },
};
