const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Returns embed"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder() 
        .setTitle(`Embed Title`)
        .setDescription(`Embed Description`)
        .setColor(0x5C14A5)
        .setImage(client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp(Date.now())
        .setAuthor({
            url: `https://www.youtube.com/@heyitsauri/videos`,
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag
        })
        .setFooter({
            iconURL: interaction.user.displayAvatarURL(),
            text: client.user.tag
        })
        .setURL(`https://www.youtube.com/@heyitsauri/videos`)
        .addFields([
            {
                name: `Field One`,
                value: `Text in Field One`,
                inline: true
            },
            {
                name: `Field Two`,
                value: `Text in Field Two`,
                inline: true
            }
        ]);
        
        await interaction.reply({
            embeds: [embed]
        }); 
  },
};
