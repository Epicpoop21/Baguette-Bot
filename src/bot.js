require("dotenv").config();
const { token, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const { Player } = require("discord-player");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.commandArray = [];
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(`.js`));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.player = new Player(client, {
  ytdlOptions: { quality: "highestaudio",
  highWaterMark: 1 << 25 } 
});

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login(token);

(async () => {
  await connect(databaseToken).catch(console.error);
})();
