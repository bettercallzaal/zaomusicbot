const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DirectLinkPlugin } = require('@distube/direct-link');
const config = require('./config');
const { loadCommands } = require('./commands');
const { loadEvents } = require('./events');
const { loadDistubeEvents } = require('./distube');
const { ZAOPlaylistPlugin } = require('./distube/ZAOPlaylistPlugin');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

const distube = new DisTube(client, {
  plugins: [
    new YouTubePlugin(),
    new SpotifyPlugin({
      api: {
        clientId: config.spotify.clientId,
        clientSecret: config.spotify.clientSecret,
      },
    }),
    new SoundCloudPlugin(),
    new DirectLinkPlugin(),
    new ZAOPlaylistPlugin(),
  ],
});

client.distube = distube;

loadCommands(client);
loadEvents(client);
loadDistubeEvents(distube);

client.login(config.token);
