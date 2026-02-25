const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a song from the queue')
    .addIntegerOption(opt =>
      opt.setName('position').setDescription('Position in queue').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const pos = interaction.options.getInteger('position') - 1;
    if (pos >= player.queue.tracks.length) {
      return interaction.reply({ content: `Invalid position. Queue has ${player.queue.tracks.length} songs.`, ephemeral: true });
    }

    const removed = player.queue.tracks.splice(pos, 1)[0];
    await interaction.reply(`🗑️ Removed **${removed.info.title}** from the queue.`);
  },
};
