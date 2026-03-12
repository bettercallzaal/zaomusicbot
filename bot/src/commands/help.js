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
          '`/play <query>` - Play a song, URL, or `audius:search`',
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
        { name: '🔊 Volume', value: [
          '`/volume <1-100>` - Set volume (DJ)',
          '`/volumeup` - Volume +5%',
          '`/volumedown` - Volume -5%',
          '`/volumebigup` - Volume +20%',
          '`/volumebigdown` - Volume -20%',
          'Starts at **50%** on join',
        ].join('\n') },
        { name: '🔧 Settings', value: [
          '`/filter <name>` - Toggle audio filter (DJ)',
        ].join('\n') },
        { name: '📻 Radio & Lofi', value: [
          '`/radio <artist>` - Play an artist on shuffle loop 24/7',
          '`/lofi` - Queue shuffled lofi tracks at 5% volume',
        ].join('\n') },
        { name: '🎧 Platforms', value: [
          'YouTube, Spotify, SoundCloud, Bandcamp, Twitch, Audius',
          'Use `audius:<search>` or paste an audius.co link',
        ].join('\n') },
        { name: '📁 Playlists', value: [
          '`/playlist list` - List all website playlists',
          '`/playlist load <name>` - Load a playlist',
          '`/save <name>` - Save current queue as playlist',
        ].join('\n') },
      )
      .setFooter({ text: '(DJ) = Requires DJ role | Volume buttons on Now Playing embed' });

    await interaction.reply({ embeds: [embed] });
  },
};
