 const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buttonrole")
    .setDescription("Returns button roles"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor('#e42643')
      .setTitle(`Press the button to get the get the ${'Vault Hunters'} role`)

    const button = new ButtonBuilder()
        .setCustomId('vhButton')
        .setLabel(`React For Vault Hunters Role`)
        .setStyle(ButtonStyle.Success);
      
    await interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(button)]
    });
  },
};
