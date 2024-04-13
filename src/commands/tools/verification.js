 const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verification")
    .setDescription("Returns verification"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor('#e42643')
      .setTitle(`React to this to agree to the rules and get the ${'Citizens'} role`)

    const button = new ButtonBuilder()
        .setCustomId('verifButton')
        .setLabel(`React To verify`)
        .setStyle(ButtonStyle.Success);
      
    await interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(button)]
    });
  },
};
