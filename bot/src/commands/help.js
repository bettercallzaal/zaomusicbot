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
          '`/play <query>` - Play a song or URL (YouTube, Spotify, SoundCloud)',
          '`/play audius:<query>` - Search and play from Audius',
          '`/play <audius.co link>` - Play an Audius link',
          '`/pause` - Pause playback (DJ)',
          '`/resume` - Resume playback (DJ)',
          '`/skip` - Skip current song (vote skip for non-DJ)',
          '`/stop` - Stop and clear queue (DJ)',
          '`/seek <seconds>` - Seek to position',
        ].join('\n') },
        { name: '📋 Queue', value: [
          '`/queue [page]` - Show the queue',
          '`/nowplaying` - Show current song with progress',
          '`/shuffle` - Shuffle the queue',
          '`/remove <pos>` - Remove from queue (DJ)',
          '`/move <from> <to>` - Reorder a track (DJ)',
          '`/clear` - Clear queue, keep current song (DJ)',
          '`/loop <off/song/queue>` - Set loop mode',
          '`/autoplay` - Toggle autoplay (DJ)',
        ].join('\n') },
        { name: '🔧 Settings', value: [
          '`/volume <1-100>` - Set exact volume (DJ)',
          '`/volumeup` / `/volumedown` - Volume +/-5% (DJ)',
          '`/volumebigup` / `/volumebigdown` - Volume +/-20% (DJ)',
          '`/filter <name>` - Toggle audio filter (DJ)',
        ].join('\n') },
        { name: '📁 Playlists & Extras', value: [
          '`/playlist list` - List all website playlists',
          '`/playlist load <name>` - Load a playlist',
          '`/save <name>` - Save current queue as playlist',
          '`/lyrics [query]` - Show lyrics for current/given song',
        ].join('\n') },
      )
      .setFooter({ text: '(DJ) = Requires DJ role | Vote skip needs >50% of voice channel' });

    await interaction.reply({ embeds: [embed] });
  },
};
