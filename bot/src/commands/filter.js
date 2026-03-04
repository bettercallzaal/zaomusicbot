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
    const fm = player.filterManager;

    const filterSettings = {
      bassboost: { key: 'equalizer', on: () => { fm.equalizerBands = Array(6).fill(null).map((_, i) => ({ band: i, gain: 0.25 })); }, off: () => { fm.equalizerBands = []; } },
      nightcore: { key: 'timescale', on: () => { fm.data.timescale = { speed: 1.3, pitch: 1.3, rate: 1.0 }; }, off: () => { fm.data.timescale = {}; } },
      vaporwave: { key: 'timescale', on: () => { fm.data.timescale = { speed: 0.85, pitch: 0.85, rate: 1.0 }; }, off: () => { fm.data.timescale = {}; } },
      karaoke: { key: 'karaoke', on: () => { fm.data.karaoke = { level: 1.0, monoLevel: 1.0, filterBand: 220.0, filterWidth: 100.0 }; }, off: () => { fm.data.karaoke = {}; } },
      tremolo: { key: 'tremolo', on: () => { fm.data.tremolo = { frequency: 2.0, depth: 0.5 }; }, off: () => { fm.data.tremolo = {}; } },
      vibrato: { key: 'vibrato', on: () => { fm.data.vibrato = { frequency: 2.0, depth: 0.5 }; }, off: () => { fm.data.vibrato = {}; } },
      rotation: { key: 'rotation', on: () => { fm.data.rotation = { rotationHz: 0.2 }; }, off: () => { fm.data.rotation = {}; } },
      lowpass: { key: 'lowPass', on: () => { fm.data.lowPass = { smoothing: 20.0 }; }, off: () => { fm.data.lowPass = {}; } },
    };

    const setting = filterSettings[filter];
    const current = fm.data[setting.key];
    const isActive = current && typeof current === 'object' && Object.keys(current).length > 0;

    if (isActive) {
      setting.off();
      await fm.applyPlayerFilters();
      await interaction.reply(`🎛️ Filter **${filter}** removed.`);
    } else {
      setting.on();
      await fm.applyPlayerFilters();
      await interaction.reply(`🎛️ Filter **${filter}** applied.`);
    }
  },
};
