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
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const pos = interaction.options.getInteger('position');
    if (pos >= queue.songs.length) {
      return interaction.reply({ content: `Invalid position. Queue has ${queue.songs.length - 1} songs.`, ephemeral: true });
    }

    const removed = queue.songs.splice(pos, 1)[0];
    await interaction.reply(`🗑️ Removed **${removed.name}** from the queue.`);
  },
};
