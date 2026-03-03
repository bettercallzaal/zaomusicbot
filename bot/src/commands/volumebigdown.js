const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volumebigdown')
    .setDescription('Decrease volume by 20%'),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const current = player.volume;
    if (current <= 0) return interaction.reply({ content: '🔇 Volume is already at minimum.', ephemeral: true });
    const newVol = Math.max(current - 20, 0);
    await player.setVolume(newVol);
    await interaction.reply(`🔉 Volume: **${newVol}%** (was ${current}%)`);
  },
};
