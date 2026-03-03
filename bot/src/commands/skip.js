const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { isDJ } = require('../utils/djPerms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });

    // DJs can always instant-skip
    if (isDJ(interaction.member)) {
      return doSkip(interaction, player);
    }

    // Non-DJ: initiate vote skip
    const voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in the voice channel to vote skip.', ephemeral: true });
    }

    const humans = voiceChannel.members.filter(m => !m.user.bot);
    const needed = Math.ceil(humans.size / 2);

    // If only 1-2 humans, just skip
    if (humans.size <= 2) {
      return doSkip(interaction, player);
    }

    const votes = new Set([interaction.user.id]);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('vote_skip')
        .setLabel(`Skip (${votes.size}/${needed})`)
        .setStyle(ButtonStyle.Primary),
    );

    const trackTitle = player.queue.current.info.title;
    const message = await interaction.reply({
      content: `⏭️ **${interaction.user.displayName}** wants to skip **${trackTitle}**\nVotes: **${votes.size}/${needed}** needed`,
      components: [row],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({ time: 30_000 });

    collector.on('collect', async (btn) => {
      if (btn.customId !== 'vote_skip') return;

      const voiceCh = btn.member.voice?.channel;
      if (!voiceCh || voiceCh.id !== voiceChannel.id) {
        return btn.reply({ content: 'You must be in the voice channel to vote.', ephemeral: true });
      }

      if (votes.has(btn.user.id)) {
        return btn.reply({ content: 'You already voted.', ephemeral: true });
      }

      votes.add(btn.user.id);

      if (votes.size >= needed) {
        collector.stop('passed');
        const currentPlayer = interaction.client.lavalink.getPlayer(interaction.guildId);
        if (currentPlayer?.queue?.current) {
          await doSkipSilent(currentPlayer);
        }
        const newRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('vote_skip')
            .setLabel(`Skipped! (${votes.size}/${needed})`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
        );
        await btn.update({
          content: `⏭️ Vote skip passed for **${trackTitle}**! (${votes.size}/${needed})`,
          components: [newRow],
        });
      } else {
        const newRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('vote_skip')
            .setLabel(`Skip (${votes.size}/${needed})`)
            .setStyle(ButtonStyle.Primary),
        );
        await btn.update({
          content: `⏭️ **${interaction.user.displayName}** wants to skip **${trackTitle}**\nVotes: **${votes.size}/${needed}** needed`,
          components: [newRow],
        });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason !== 'passed') {
        const expiredRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('vote_skip')
            .setLabel(`Vote expired (${votes.size}/${needed})`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        );
        message.edit({
          content: `⏭️ Vote skip expired for **${trackTitle}**. (${votes.size}/${needed})`,
          components: [expiredRow],
        }).catch(() => {});
      }
    });
  },
};

async function doSkip(interaction, player) {
  if (player.queue.tracks.length === 0) {
    await player.stopPlaying(true, false);
    return interaction.reply('⏭️ Skipped. No more songs in queue.');
  }
  await player.skip();
  await interaction.reply('⏭️ Skipped.');
}

async function doSkipSilent(player) {
  if (player.queue.tracks.length === 0) {
    await player.stopPlaying(true, false);
  } else {
    await player.skip();
  }
}
