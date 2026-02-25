require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  djRoleId: process.env.DJ_ROLE_ID,
  lavalink: {
    host: process.env.LAVALINK_HOST || 'localhost',
    port: parseInt(process.env.LAVALINK_PORT || '2333'),
    password: process.env.LAVALINK_PASSWORD || 'zaomusicbot',
  },
  playlistApi: {
    url: process.env.PLAYLIST_API_URL || 'http://localhost:3000',
    key: process.env.PLAYLIST_API_KEY,
  },
};
