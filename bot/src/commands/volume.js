const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the playback volume')
    .addIntegerOption(opt =>
      opt.setName('level').setDescription('Volume level (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    ),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const level = interaction.options.getInteger('level');
    queue.setVolume(level);
    await interaction.reply(`🔊 Volume set to **${level}%**`);
  },
};
