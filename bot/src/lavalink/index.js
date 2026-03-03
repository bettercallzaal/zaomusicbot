const { nowPlayingEmbed } = require('../components/embeds');
const { createPlayerRow } = require('../components/playerButtons');

function loadLavalinkEvents(client) {
  const lavalink = client.lavalink;

  // Connect lavalink when bot is ready
  client.once('ready', () => {
    lavalink.init({ id: client.user.id, username: client.user.username });
  });

  // Forward voice state updates to lavalink
  client.on('raw', (data) => {
    lavalink.sendRawData(data);
  });

  lavalink.on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;
    const embed = nowPlayingEmbed(track, player);
    const rows = createPlayerRow();
    channel.send({ embeds: [embed], components: rows });
  });

  lavalink.on('trackEnd', (player, track, reason) => {
    // Handled by autoSkip
  });

  lavalink.on('queueEnd', (player) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
      channel.send({ embeds: [{ color: 0x5865f2, description: 'Queue finished. I\'ll leave in 30 seconds if nothing is added.' }] });
    }
  });

  lavalink.on('trackError', (player, track, payload) => {
    console.error('Track error:', payload);
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
      channel.send({ embeds: [{ color: 0xed4245, title: 'Error', description: `Failed to play **${track.info.title}**: ${payload.exception?.message || 'Unknown error'}` }] });
    }
  });

  lavalink.on('trackStuck', (player, track, payload) => {
    console.error('Track stuck:', track.info.title);
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
      channel.send({ embeds: [{ color: 0xfee75c, description: `Track **${track.info.title}** got stuck. Skipping...` }] });
    }
    player.skip();
  });

  lavalink.on('playerDisconnect', (player) => {
    player.destroy();
  });

  // Handle Lavalink node errors without crashing
  lavalink.on('nodeError', (node, error) => {
    console.error(`Lavalink node "${node.id}" error:`, error.message);
  });

  lavalink.on('nodeDisconnect', (node, reason) => {
    console.warn(`Lavalink node "${node.id}" disconnected. Reconnecting...`);
  });

  lavalink.on('nodeReconnect', (node) => {
    console.log(`Lavalink node "${node.id}" reconnected.`);
  });

  // Catch unhandled errors on the client to prevent crashes
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error.message || error);
  });

  console.log('Loaded Lavalink events');
}

module.exports = { loadLavalinkEvents };
