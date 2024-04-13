module.exports = {
  data: {
    name: `vhButton`,
  },
  async execute(interaction, client) {
    let vhRole = interaction.guild.roles.cache.get("1137474361817845971");

    const member = interaction.member;
    member.roles.add(vhRole);

    await interaction.reply({
      content: `Vault Hunters role added`,
      ephemeral: true,
    });
  },
};
