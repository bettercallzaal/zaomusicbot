const { SlashCommandBuilder } = require('discord.js');
const { RepeatMode } = require('distube');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set loop mode')
    .addStringOption(opt =>
      opt.setName('mode').setDescription('Loop mode').setRequired(true)
        .addChoices(
          { name: 'Off', value: 'off' },
          { name: 'Song', value: 'song' },
          { name: 'Queue', value: 'queue' },
        )
    ),

  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const mode = interaction.options.getString('mode');
    const modeMap = {
      off: RepeatMode.DISABLED,
      song: RepeatMode.SONG,
      queue: RepeatMode.QUEUE,
    };

    queue.setRepeatMode(modeMap[mode]);
    await interaction.reply(`🔁 Loop mode: **${mode.charAt(0).toUpperCase() + mode.slice(1)}**`);
  },
};
