const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    if (player.queue.tracks.length === 0) {
      await player.stopPlaying(true, false);
      return interaction.reply('⏭️ Skipped. No more songs in queue.');
    }

    await player.skip();
    await interaction.reply('⏭️ Skipped.');
  },
};
