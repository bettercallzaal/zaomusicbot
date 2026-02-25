const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    await player.queue.shuffle();
    await interaction.reply('🔀 Queue shuffled.');
  },
};
