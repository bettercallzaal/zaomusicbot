const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Toggle an audio filter')
    .addStringOption(opt =>
      opt.setName('name').setDescription('Filter name').setRequired(true)
        .addChoices(
          { name: 'Bass Boost', value: 'bassboost' },
          { name: 'Nightcore', value: 'nightcore' },
          { name: 'Vaporwave', value: 'vaporwave' },
          { name: 'Karaoke', value: 'karaoke' },
          { name: 'Tremolo', value: 'tremolo' },
          { name: 'Vibrato', value: 'vibrato' },
          { name: 'Rotation', value: 'rotation' },
          { name: 'Low Pass', value: 'lowpass' },
        )
    ),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const filter = interaction.options.getString('name');

    const filterData = {
      bassboost: { equalizer: Array(6).fill(null).map((_, i) => ({ band: i, gain: 0.25 })) },
      nightcore: { timescale: { speed: 1.3, pitch: 1.3, rate: 1.0 } },
      vaporwave: { timescale: { speed: 0.85, pitch: 0.85, rate: 1.0 } },
      karaoke: { karaoke: { level: 1.0, monoLevel: 1.0, filterBand: 220.0, filterWidth: 100.0 } },
      tremolo: { tremolo: { frequency: 2.0, depth: 0.5 } },
      vibrato: { vibrato: { frequency: 2.0, depth: 0.5 } },
      rotation: { rotation: { rotationHz: 0.2 } },
      lowpass: { lowPass: { smoothing: 20.0 } },
    };

    // Toggle: check if filter is already active
    const currentFilters = player.filterManager?.data || {};
    const filterKey = Object.keys(filterData[filter])[0];
    const isActive = currentFilters[filterKey];

    if (isActive) {
      await player.setFilters({ [filterKey]: null });
      await interaction.reply(`🎛️ Filter **${filter}** removed.`);
    } else {
      await player.setFilters(filterData[filter]);
      await interaction.reply(`🎛️ Filter **${filter}** applied.`);
    }
  },
};
