const { Events } = require('discord.js');

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const client = oldState.client || newState.client;
    const lavalink = client.lavalink;

    // Auto-disconnect when bot is alone in voice channel
    if (oldState.member && !oldState.member.user.bot && oldState.channelId) {
      const channel = oldState.channel;
      if (!channel) return;

      const botMember = channel.members.get(client.user.id);
      if (!botMember) return;

      const humans = channel.members.filter(m => !m.user.bot);
      if (humans.size === 0) {
        setTimeout(async () => {
          try {
            const refreshed = oldState.guild.channels.cache.get(channel.id);
            if (refreshed) {
              const stillAlone = refreshed.members.filter(m => !m.user.bot).size === 0;
              if (stillAlone) {
                const player = lavalink.getPlayer(oldState.guild.id);
                if (player) {
                  await player.destroy();
                }
                console.log(`Left empty voice channel in ${oldState.guild.name}`);
              }
            }
          } catch (error) {
            console.error('Auto-disconnect error:', error.message);
          }
        }, 30_000); // 30 second grace period
      }
    }
  },
};
