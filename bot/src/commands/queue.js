const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { queueEmbed } = require('../components/embeds');

function createQueueButtons(page, totalPages) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`queue_prev_${page}`)
      .setEmoji('◀️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page <= 0),
    new ButtonBuilder()
      .setCustomId(`queue_next_${page}`)
      .setEmoji('▶️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages - 1),
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue')
    .addIntegerOption(opt =>
      opt.setName('page').setDescription('Page number').setMinValue(1)
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    const page = (interaction.options.getInteger('page') || 1) - 1;
    const totalPages = Math.ceil(player.queue.tracks.length / 10) || 1;
    const embed = queueEmbed(player, page);
    const row = createQueueButtons(page, totalPages);

    const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const collector = message.createMessageComponentCollector({ time: 120_000 });

    collector.on('collect', async (btn) => {
      if (btn.user.id !== interaction.user.id) {
        return btn.reply({ content: 'Only the command user can navigate pages.', ephemeral: true });
      }

      const currentPlayer = interaction.client.lavalink.getPlayer(interaction.guildId);
      if (!currentPlayer || !currentPlayer.queue.current) {
        return btn.update({ content: 'Nothing is playing anymore.', embeds: [], components: [] });
      }

      let newPage = page;
      if (btn.customId.startsWith('queue_prev_')) {
        newPage = parseInt(btn.customId.split('_')[2]) - 1;
      } else if (btn.customId.startsWith('queue_next_')) {
        newPage = parseInt(btn.customId.split('_')[2]) + 1;
      }

      const newTotalPages = Math.ceil(currentPlayer.queue.tracks.length / 10) || 1;
      newPage = Math.max(0, Math.min(newPage, newTotalPages - 1));

      const newEmbed = queueEmbed(currentPlayer, newPage);
      const newRow = createQueueButtons(newPage, newTotalPages);
      await btn.update({ embeds: [newEmbed], components: [newRow] });
    });

    collector.on('end', () => {
      message.edit({ components: [] }).catch(() => {});
    });
  },
};
