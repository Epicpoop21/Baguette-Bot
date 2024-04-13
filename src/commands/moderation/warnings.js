const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const warnModel = require("../../schemas/warnModel");
const mongoose = require("mongoose");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Displays a member's warnings")
    .addUserOption((option) =>
      option
        .setName("target")
        .setRequired(true)
        .setDescription("The member to check")
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");

    const userWarnings = await warnModel.find({
      userId: user.id,
      guildId: interaction.guildId,
    });

    if (!userWarnings?.length) {
      await interaction.reply({
        content: `${user} has no warnings`,
      });
    } else {
      const embedDescription = userWarnings
        .map((warn) => {
          const moderator = interaction.guild.members.cache.get(
            warn.moderatorId
          );

          return [
            (warnId = warn._id),
            (Moderator = moderator || "Has left"),
            (Day = moment(warn.timestamp).format("MMMM Do YYYY")),
            (Reason = warn.reason),
            (Type = warn.warnType),
          ].join("\n");
        })
        .join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle(`${user.tag}'s warnings'`)
        .setDescription(warn.warnId)
        .setColor(0x9e6a3f);

      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
