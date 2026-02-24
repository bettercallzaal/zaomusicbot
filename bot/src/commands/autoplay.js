const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Toggle autoplay mode'),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const state = queue.toggleAutoplay();
    await interaction.reply(`🤖 Autoplay: **${state ? 'On' : 'Off'}**`);
  },
};
