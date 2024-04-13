module.exports = {
  data: {
    name: `verifButton`,
  },
  async execute(interaction, client) {
    let verifRole = interaction.guild.roles.cache.get("993319327967227919");

    const member = interaction.member;
    member.roles.add(verifRole);

    await interaction.reply({
      content: `Citizen role added`,
      ephemeral: true,
    });
  },
};
