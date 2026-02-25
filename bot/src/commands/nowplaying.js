const { SlashCommandBuilder } = require('discord.js');
const { nowPlayingEmbed } = require('../components/embeds');
const { createPlayerRow } = require('../components/playerButtons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const embed = nowPlayingEmbed(player.queue.current);
    const row = createPlayerRow();
    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
