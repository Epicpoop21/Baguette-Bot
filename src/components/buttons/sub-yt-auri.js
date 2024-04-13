module.exports = {
  data: {
    name: `sub-yt-auri`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `https://www.youtube.com/@heyitsauri/videos`
    })
  },
};
