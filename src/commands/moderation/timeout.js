const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const warnModel = require("../../schemas/warnModel");
const mongoose = require("mongoose");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeouts the member provided")
    .addUserOption((option) =>
      option
        .setName("target")
        .setRequired(true)
        .setDescription("The member to timeout")
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("Amount of minutes to time user out for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setRequired(true)
        .setDescription("The reason for timing the member")
    ),
  async execute(interaction, client) {
    const moglogChannel = client.channels.cache.get("1128078250170654730");
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const time = interaction.options.getInteger("time");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

      const modlogEmbed = new EmbedBuilder()
      .setTitle(`A user has been timed out`)
      .setColor(0x08800a)
      .setThumbnail("https://i.imgur.com/cVtzp1M.png")
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setFooter({
        text: client.user.tag,
      })
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
          value: `${reason} | (${time} minutes)`,
          inline: false,
        },
      ]);

    const userEmbed = new EmbedBuilder()
      .setTitle(`You have been timed out in ${interaction.guild.name}`)
      .setColor(0x9e6a3f)
      .setThumbnail("https://i.imgur.com/cVtzp1M.png")
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .addFields([
        {
          name: `Reason`,
          value: `${reason} | ${time} minutes`,
          inline: false,
        },
      ]);

    await user
      .send({
        embeds: [userEmbed],
      })
      .catch(console.log("User's DMs are off"));

    await member.timeout(time * 60 * 1000, reason).catch(console.error);

    new warnModel({
      userId: user.id,
      guildId: interaction.guildId,
      moderatorId: interaction.user.id,
      reason: `${reason} | ${time} minutes`,
      timestamp: Date.now(),
      warnType: "timeout",
    }).save();

    moglogChannel.send({ embeds: [modlogEmbed] });

    await interaction.reply({
      content: `Successfully timed out ${user.tag} for ${time} minutes`,
    });
  },
};
