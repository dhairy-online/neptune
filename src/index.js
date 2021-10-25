// Copyright (c) 2021-2021 Dhairy Srivastava. All rights reserved. MIT license.

const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const red = require("chalk");

/** The file where the token is stored */
const { token } = require("./token.js");

const client = new Client({
  partials: ["CHANNEL"],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

client.commands = new Collection();

const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


// Load slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const commands = client.commands;
  const command = commands.get(interaction.commandName);

  if (!command) return;

  if(interaction.channel.type == "DM"){
    interaction.reply("Commands are not allowed to be used in DM's");
  } else {
    try {
      await command.execute(interaction);
    } catch (err) {
      console.log(red("Interaction Failed"));
      console.error(err);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
  
});

client
  .on("disconnect", () => console.warn("Disconnecting..."))
  .on("reconnecting", () => console.info("Reconnecting..."));

client.login(token);
