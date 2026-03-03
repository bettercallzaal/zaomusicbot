require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

// Validate required env vars on startup
const required = ['DISCORD_TOKEN', 'CLIENT_ID'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// Warn for optional missing vars
const optional = {
  GUILD_ID: 'Commands will be registered globally (slower updates)',
  DJ_ROLE_ID: 'DJ-only commands will be available to everyone',
  LAVALINK_PASSWORD: 'Using default Lavalink password',
  PLAYLIST_API_KEY: 'Playlist API key not set — /save command may not work',
};
for (const [key, warning] of Object.entries(optional)) {
  if (!process.env[key]) {
    console.warn(`WARNING: ${key} not set — ${warning}`);
  }
}

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
