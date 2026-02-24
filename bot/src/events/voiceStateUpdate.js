const { Events } = require('discord.js');

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const client = oldState.client || newState.client;
    const distube = client.distube;

    // Auto-disconnect when bot is alone in voice channel
    if (oldState.member && !oldState.member.user.bot && oldState.channelId) {
      const channel = oldState.channel;
      if (!channel) return;

      const botMember = channel.members.get(client.user.id);
      if (!botMember) return;

      const humans = channel.members.filter(m => !m.user.bot);
      if (humans.size === 0) {
        setTimeout(() => {
          const refreshed = oldState.guild.channels.cache.get(channel.id);
          if (refreshed) {
            const stillAlone = refreshed.members.filter(m => !m.user.bot).size === 0;
            if (stillAlone) {
              const queue = distube.getQueue(oldState.guild.id);
              if (queue) {
                queue.stop();
              }
              distube.voices.leave(oldState.guild.id);
              console.log(`Left empty voice channel in ${oldState.guild.name}`);
            }
          }
        }, 30_000); // 30 second grace period
      }
    }
  },
};
