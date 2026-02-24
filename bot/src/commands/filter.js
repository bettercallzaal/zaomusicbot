const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

const FILTERS = [
  '3d', 'bassboost', 'echo', 'karaoke', 'nightcore',
  'vaporwave', 'flanger', 'gate', 'haas', 'reverse',
  'surround', 'mcompand', 'phaser', 'tremolo', 'earwax',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Toggle an audio filter')
    .addStringOption(opt =>
      opt.setName('name').setDescription('Filter name').setRequired(true)
        .addChoices(...FILTERS.map(f => ({ name: f, value: f })))
    ),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const filter = interaction.options.getString('name');
    if (queue.filters.has(filter)) {
      queue.filters.remove(filter);
      await interaction.reply(`🎛️ Filter **${filter}** removed.`);
    } else {
      queue.filters.add(filter);
      await interaction.reply(`🎛️ Filter **${filter}** applied.`);
    }
  },
};
