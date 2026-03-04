const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { isDJ } = require('../utils/djPerms');

function createPlayerRow() {
  const controlRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('player_pause').setEmoji('⏸️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('player_loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary),
  );

  const volumeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('player_bigvoldown').setLabel('--').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_voldown').setLabel('-').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_volup').setLabel('+').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_bigvolup').setLabel('++').setStyle(ButtonStyle.Secondary),
  );

  return [controlRow, volumeRow];
}

async function handleButton(interaction) {
  if (!interaction.customId.startsWith('player_')) return;

  const player = interaction.client.lavalink.getPlayer(interaction.guildId);
  if (!player || !player.queue.current) {
    return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
  }

  const member = interaction.member;
  const voiceChannel = member.voice?.channel;
  if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
    return interaction.reply({ content: 'You must be in the same voice channel.', ephemeral: true });
  }

  const action = interaction.customId.replace('player_', '');

  try {
    switch (action) {
      case 'pause':
        if (player.paused) {
          await player.resume();
          await interaction.reply({ content: '▶️ Resumed.' });
        } else {
          await player.pause();
          await interaction.reply({ content: '⏸️ Paused.' });
        }
        break;

      case 'skip':
        if (player.queue.tracks.length === 0) {
          await player.stopPlaying(true, false);
          await interaction.reply({ content: '⏭️ Skipped. No more songs in queue.' });
        } else {
          await player.skip();
          await interaction.reply({ content: '⏭️ Skipped.' });
        }
        break;

      case 'stop':
        if (!isDJ(member)) {
          return interaction.reply({ content: 'You need the DJ role to stop.', ephemeral: true });
        }
        await player.destroy();
        await interaction.reply({ content: '⏹️ Stopped and cleared the queue.' });
        break;

      case 'loop': {
        const modes = ['off', 'track', 'queue'];
        const labels = ['Off', 'Song', 'Queue'];
        const current = modes.indexOf(player.repeatMode);
        const next = (current + 1) % modes.length;
        await player.setRepeatMode(modes[next]);
        await interaction.reply({ content: `🔁 Loop: **${labels[next]}**` });
        break;
      }

      case 'shuffle':
        await player.queue.shuffle();
        await interaction.reply({ content: '🔀 Queue shuffled.' });
        break;

      case 'volup': {
        const newVol = Math.min(100, player.volume + 5);
        await player.setVolume(newVol);
        await interaction.reply({ content: `🔊 Volume: **${newVol}%** (+5)` });
        break;
      }

      case 'voldown': {
        const newVol = Math.max(0, player.volume - 5);
        await player.setVolume(newVol);
        await interaction.reply({ content: `🔉 Volume: **${newVol}%** (-5)` });
        break;
      }

      case 'bigvolup': {
        const newVol = Math.min(100, player.volume + 20);
        await player.setVolume(newVol);
        await interaction.reply({ content: `🔊 Volume: **${newVol}%** (+20)` });
        break;
      }

      case 'bigvoldown': {
        const newVol = Math.max(0, player.volume - 20);
        await player.setVolume(newVol);
        await interaction.reply({ content: `🔉 Volume: **${newVol}%** (-20)` });
        break;
      }
    }
  } catch (error) {
    console.error('Button error:', error.message);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: `Error: ${error.message}`, ephemeral: true });
    }
  }
}

module.exports = { createPlayerRow, handleButton };
