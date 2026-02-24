const { SlashCommandBuilder } = require('discord.js');
const { RepeatMode } = require('distube');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    if (queue.songs.length <= 1 && queue.repeatMode === RepeatMode.DISABLED) {
      queue.stop();
      return interaction.reply('⏭️ Skipped. No more songs in queue.');
    }

    await queue.skip();
    await interaction.reply('⏭️ Skipped.');
  },
};
