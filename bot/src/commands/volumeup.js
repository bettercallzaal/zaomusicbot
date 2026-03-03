const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volumeup')
    .setDescription('Increase volume by 5%'),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const current = player.volume;
    if (current >= 100) return interaction.reply({ content: '🔊 Volume is already at max (100%).', ephemeral: true });
    const newVol = Math.min(current + 5, 100);
    await player.setVolume(newVol);
    await interaction.reply(`🔊 Volume: **${newVol}%** (was ${current}%)`);
  },
};
