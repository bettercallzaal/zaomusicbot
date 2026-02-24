const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { isDJ } = require('../utils/djPerms');
const { RepeatMode } = require('distube');

function createPlayerRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('player_pause').setEmoji('⏸️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('player_loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary),
  );
}

async function handleButton(interaction) {
  if (!interaction.customId.startsWith('player_')) return;

  const distube = interaction.client.distube;
  const queue = distube.getQueue(interaction.guildId);

  if (!queue) {
    return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
  }

  const member = interaction.member;
  const voiceChannel = member.voice?.channel;
  if (!voiceChannel || voiceChannel.id !== queue.voice.channelId) {
    return interaction.reply({ content: 'You must be in the same voice channel.', ephemeral: true });
  }

  const action = interaction.customId.replace('player_', '');

  switch (action) {
    case 'pause':
      if (queue.paused) {
        queue.resume();
        await interaction.reply({ content: '▶️ Resumed.' });
      } else {
        queue.pause();
        await interaction.reply({ content: '⏸️ Paused.' });
      }
      break;

    case 'skip':
      if (queue.songs.length <= 1 && queue.repeatMode === RepeatMode.DISABLED) {
        queue.stop();
        await interaction.reply({ content: '⏭️ Skipped. No more songs in queue.' });
      } else {
        await queue.skip();
        await interaction.reply({ content: '⏭️ Skipped.' });
      }
      break;

    case 'stop':
      if (!isDJ(member)) {
        return interaction.reply({ content: 'You need the DJ role to stop.', ephemeral: true });
      }
      queue.stop();
      await interaction.reply({ content: '⏹️ Stopped and cleared the queue.' });
      break;

    case 'loop': {
      const modes = [RepeatMode.DISABLED, RepeatMode.SONG, RepeatMode.QUEUE];
      const labels = ['Off', 'Song', 'Queue'];
      const next = (modes.indexOf(queue.repeatMode) + 1) % modes.length;
      queue.setRepeatMode(modes[next]);
      await interaction.reply({ content: `🔁 Loop: **${labels[next]}**` });
      break;
    }

    case 'shuffle':
      queue.shuffle();
      await interaction.reply({ content: '🔀 Queue shuffled.' });
      break;
  }
}

module.exports = { createPlayerRow, handleButton };
