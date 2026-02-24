const { SlashCommandBuilder } = require('discord.js');
const { nowPlayingEmbed } = require('../components/embeds');
const { createPlayerRow } = require('../components/playerButtons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song'),

  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const embed = nowPlayingEmbed(queue.songs[0]);
    const row = createPlayerRow();
    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
