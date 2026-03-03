const { SlashCommandBuilder } = require('discord.js');
const { formatDuration } = require('../utils/formatDuration');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a position in the current song')
    .addIntegerOption(opt =>
      opt.setName('seconds').setDescription('Position in seconds').setRequired(true).setMinValue(0)
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const seconds = interaction.options.getInteger('seconds');
    const track = player.queue.current;
    const durationSec = Math.floor(track.info.duration / 1000);

    if (seconds > durationSec) {
      return interaction.reply({
        content: `Position exceeds track duration. Current track is **${formatDuration(durationSec)}** long.`,
        ephemeral: true,
      });
    }

    const currentPos = formatDuration(Math.floor(player.position / 1000));
    await player.seek(seconds * 1000);
    await interaction.reply(
      `⏩ Seeked to **${formatDuration(seconds)}** (was at ${currentPos}) | Total: \`${formatDuration(durationSec)}\``
    );
  },
};
