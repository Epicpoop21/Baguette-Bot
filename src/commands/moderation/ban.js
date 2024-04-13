const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans the member provided")
    .addUserOption((option) =>
      option
        .setName("target")
        .setRequired(true)
        .setDescription("The member to ban")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setRequired(true)
        .setDescription("The reason for banninh the member")
    ),
  async execute(interaction, client) {
    const moglogChannel = client.channels.cache.get("1128078250170654730");
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    const modlogEmbed = new EmbedBuilder()
      .setTitle(`A user has been banned`)
      .setColor(0x731d17)
      .setThumbnail(iconURL("https://i.imgur.com/Bl62rGd.png"))
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setFooter({
        text: client.user.tag,
      })
      .setURL(`https://www.youtube.com/@heyitsauri/videos`)
      .addFields([
        {
          name: `Member`,
          value: `${user}`,
          inline: true,
        },
        {
          name: `Moderator`,
          value: `${interaction.user}`,
          inline: true,
        },
        {
          name: `Reason`,
          value: `${reason}`,
          inline: false,
        },
      ]);

    const userEmbed = new EmbedBuilder()
      .setTitle(`You have been banned from ${interaction.guild.name}`)
      .setColor(0x731d17)
      .setThumbnail(iconURL("https://i.imgur.com/Bl62rGd.png"))
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .addFields([
        {
          name: `Reason`,
          value: `${reason}`,
          inline: false,
        },
      ]);

    await user
      .send({
        embeds: [userEmbed],
      })
      .catch(console.log("User's DMs are off"));

      new warnModel({
        userId: user.id,
        guildId: interaction.guildId,
        moderatorId: interaction.user.id,
        reason: `${reason}`,
        timestamp: Date.now(),
        warnType: "ban",
      }).save();

    await member.ban(reason).catch(console.error);

    moglogChannel.send({ embeds: [modlogEmbed] });

    await interaction.reply({
      content: `Successfully banned ${user.tag}`,
    });
  },
};
