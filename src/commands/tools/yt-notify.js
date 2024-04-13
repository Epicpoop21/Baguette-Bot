const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const notifyschema = require("../../schemas/notify");
const Parser = require("rss-parser");
const parser = new Parser();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube-notify")
    .setDescription("Confuigures YouTube notification system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`add`)
        .setDescription("Adds a YouTube channel to the list")
        .addStringOption((option) =>
          option
            .setName(`channel-id`)
            .setDescription(`The ID of the YouTube channel`)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the notification in")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              "Message with notificaiton. Use {author}, {link} and {title}"
            )
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to ping")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`remove`)
        .setDescription("Removes a YouTube channel from the list")
        .addStringOption((option) =>
          option
            .setName("channel-id")
            .setDescription("ID of YouTube channel to remove")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const { options } = interaction;

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: `You can't use this command`,
        ephemeral: true,
      });

    const sub = options.getSubcommand();
    const data = await notifyschema.find({ Guild: interaction.guild.id });

    switch (sub) {
      case "add":
        if (data.length) {
          if (data.length >= 15) {
            return await interaction.reply({
              content: `You can only have 15 active notifications at once`,
              ephemeral: true,
            });
          }
        }

        const ID = options.getString("channel-id");
        const channel = options.getChannel("channel");
        const pingrole = options.getRole("role");
        const message = options.getString("message");

        let role = `nom`;

        if (pingrole) {
          role = pingrole.id;
        }

        let checkdata = await notifyschema.findOne({
          Guild: interaction.guild.id,
          ID: ID
        });
        if (checkdata) {
          await interaction.deferReply({ ephemeral: true });

          let author = "";

          const videodata = await parser.parseURL(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${ID}`
          );
          if (videodata) {
            author = videodata.items[0].author;
          } else {
            author = "Unknown";
          }

          return await interaction.editReply({
            content: `You already have a YouTube notification set up for **${author}**`,
            ephemeral: true,
          });
        } else {
          await interaction.deferReply({ ephemeral: true });
        } 

        try {
          const videodata = await parser.parseURL(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${ID}`
          );
          let author = "";
          if (videodata) {
            author = videodata.items[0].author;
          } else {
            author = "Unknown";
          }

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`YouTube Notifications Enabled`)
            .addFields({
              name: "**YouTube Channel**",
              value: `${author}`,
              inline: true,
            })
            .addFields({
              name: "**Discord Channel**",
              value: `${channel}`,
              inline: true,
            });

          if (pingrole) {
            embed.addFields({ name: "Ping Role", value: `${pingrole}` });
          }

          if (message) {
            embed.addFields({
              name: "Upload message",
              value: `${message
                .replace("{author}", "Channel")
                .replace("{link}", "youtube.com")
                .replace("{title}", "your title")
                .replace(`{newline}`, `\n`)
              }`,
            });
          }

          await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (err) {
          return await interaction.editReply({
            content: `The channel with the ID of ${ID} does not exist`,
            ephemeral: true,
          });
        } 

        await notifyschema.create({
          Guild: interaction.guild.id,
          Channel: channel.id,
          ID: ID,
          Latest: "none",
          Message: message || "",
          PingRole: role || "",
        });

        break;
      case "remove":
        if (!data)
          return await interaction.reply({
            content: `You do not have the YouTube notification system set up here yet`,
            ephemeral: true,
          });
        else {
          const ID = options.getString("channel-id");
          let checkdata = await notifyschema.findOne({
            Guild: interaction.guild.id,
            ID: ID,
          });
          if (!checkdata)
            return await interaction.reply({
              content: `That YouTube notifier does not exist`,
              ephemeral: true,
            });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Creator ${ID} has had their channel removed`);

          await interaction.reply({ embeds: [embed], ephemeral: true });
          await notifyschema.deleteMany({
            Guild: interaction.guild.id,
            ID: ID,
          });
        }
    }
  },
};
