require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  djRoleId: process.env.DJ_ROLE_ID,
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  playlistApi: {
    url: process.env.PLAYLIST_API_URL || 'http://localhost:3000',
    key: process.env.PLAYLIST_API_KEY,
  },
};
