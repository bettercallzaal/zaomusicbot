const { REST, Routes } = require('discord.js');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
loadCommands(client);

const commands = Array.from(client.commands.values()).map(c => c.data.toJSON());

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`Refreshing ${commands.length} slash commands...`);

    if (config.guildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
      console.log(`Registered ${commands.length} guild commands`);
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      console.log(`Registered ${commands.length} global commands`);
    }
  } catch (error) {
    console.error(error);
  }
})();
