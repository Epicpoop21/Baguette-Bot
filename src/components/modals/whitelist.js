module.exports = { 
    data: {
        name: "whitelist"
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `Username is: ${interaction.fields.getTextInputValue("whitelistName")}`
        });
    }
}
