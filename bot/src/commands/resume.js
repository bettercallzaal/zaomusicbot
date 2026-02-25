const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume playback'),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    await player.resume();
    await interaction.reply('▶️ Resumed.');
  },
};
