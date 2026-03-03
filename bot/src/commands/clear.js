const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear the queue without stopping the current song'),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;

    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) {
      return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    }

    const count = player.queue.tracks.length;
    if (count === 0) {
      return interaction.reply({ content: 'The queue is already empty.', ephemeral: true });
    }

    player.queue.tracks.splice(0, count);
    await interaction.reply(`Cleared **${count}** tracks from the queue. Current song continues playing.`);
  },
};
