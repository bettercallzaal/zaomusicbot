const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('ZAOMusicBot Commands')
      .setDescription('Here are all the available commands:')
      .addFields(
        { name: '🎵 Playback', value: [
          '`/play <query>` - Play a song or URL',
          '`/pause` - Pause playback (DJ)',
          '`/resume` - Resume playback (DJ)',
          '`/skip` - Skip current song',
          '`/stop` - Stop and clear queue (DJ)',
          '`/seek <seconds>` - Seek to position',
        ].join('\n') },
        { name: '📋 Queue', value: [
          '`/queue [page]` - Show the queue',
          '`/nowplaying` - Show current song',
          '`/shuffle` - Shuffle the queue',
          '`/remove <pos>` - Remove from queue (DJ)',
          '`/loop <off/song/queue>` - Set loop mode',
          '`/autoplay` - Toggle autoplay (DJ)',
        ].join('\n') },
        { name: '🔧 Settings', value: [
          '`/volume <1-100>` - Set volume (DJ)',
          '`/filter <name>` - Toggle audio filter (DJ)',
        ].join('\n') },
        { name: '📁 Playlists', value: [
          '`/playlist list` - List all website playlists',
          '`/playlist load <name>` - Load a playlist',
        ].join('\n') },
      )
      .setFooter({ text: '(DJ) = Requires DJ role' });

    await interaction.reply({ embeds: [embed] });
  },
};
