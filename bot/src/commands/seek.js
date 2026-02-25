const { SlashCommandBuilder } = require('discord.js');

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
    await player.seek(seconds * 1000); // Lavalink uses ms
    await interaction.reply(`⏩ Seeked to **${seconds}s**`);
  },
};
