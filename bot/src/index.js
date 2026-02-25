const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { LavalinkManager } = require('lavalink-client');
const config = require('./config');
const { loadCommands } = require('./commands');
const { loadEvents } = require('./events');
const { loadLavalinkEvents } = require('./lavalink');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

client.lavalink = new LavalinkManager({
  nodes: [
    {
      id: 'main',
      host: config.lavalink.host,
      port: config.lavalink.port,
      authorization: config.lavalink.password,
    },
  ],
  sendToShard: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  },
  client: {
    id: config.clientId,
    username: 'ZAOMusicBot',
  },
  autoSkip: true,
  playerOptions: {
    defaultSearchPlatform: 'ytsearch',
    onEmptyQueue: {
      destroyAfterMs: 30_000,
    },
  },
});

loadCommands(client);
loadEvents(client);
loadLavalinkEvents(client);

client.login(config.token);
