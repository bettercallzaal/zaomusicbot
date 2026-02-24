const { SlashCommandBuilder } = require('discord.js');
const { queueEmbed } = require('../components/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue')
    .addIntegerOption(opt =>
      opt.setName('page').setDescription('Page number').setMinValue(1)
    ),

  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const page = (interaction.options.getInteger('page') || 1) - 1;
    const embed = queueEmbed(queue, page);
    await interaction.reply({ embeds: [embed] });
  },
};
