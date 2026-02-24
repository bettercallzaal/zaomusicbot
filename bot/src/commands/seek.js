const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a position in the current song')
    .addIntegerOption(opt =>
      opt.setName('seconds').setDescription('Position in seconds').setRequired(true).setMinValue(0)
    ),

  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const seconds = interaction.options.getInteger('seconds');
    queue.seek(seconds);
    await interaction.reply(`⏩ Seeked to **${seconds}s**`);
  },
};
