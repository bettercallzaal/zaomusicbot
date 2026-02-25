const { SlashCommandBuilder } = require('discord.js');
const { requireDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Toggle autoplay mode (plays related songs when queue ends)'),

  async execute(interaction) {
    if (!requireDJ(interaction)) return;
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    // Store autoplay state on the player
    player.autoplay = !player.autoplay;
    await interaction.reply(`🤖 Autoplay: **${player.autoplay ? 'On' : 'Off'}**`);
  },
};
