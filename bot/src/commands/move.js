const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Move a track to a different position in the queue')
    .addIntegerOption(opt =>
      opt.setName('from').setDescription('Current position of the track').setRequired(true).setMinValue(1)
    )
    .addIntegerOption(opt =>
      opt.setName('to').setDescription('New position for the track').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;

    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) {
      return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    }

    const from = interaction.options.getInteger('from');
    const to = interaction.options.getInteger('to');
    const tracks = player.queue.tracks;

    if (from > tracks.length || to > tracks.length) {
      return interaction.reply({
        content: `Invalid position. Queue has **${tracks.length}** tracks.`,
        ephemeral: true,
      });
    }

    if (from === to) {
      return interaction.reply({ content: 'Track is already at that position.', ephemeral: true });
    }

    // Remove track from old position and insert at new position
    const [moved] = tracks.splice(from - 1, 1);
    tracks.splice(to - 1, 0, moved);

    await interaction.reply(
      `Moved **${moved.info.title}** from position **#${from}** to **#${to}**.`
    );
  },
};
