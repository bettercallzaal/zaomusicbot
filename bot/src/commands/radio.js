const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radio')
    .setDescription('Play an artist on repeat like a radio station')
    .addStringOption(opt =>
      opt.setName('artist').setDescription('Artist name to play').setRequired(true)
    ),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    }

    const artist = interaction.options.getString('artist');
    await interaction.deferReply();

    try {
      let player = interaction.client.lavalink.getPlayer(interaction.guildId);
      if (!player) {
        player = interaction.client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
        });
        await player.connect();
      } else if (player.voiceChannelId !== voiceChannel.id) {
        player.voiceChannelId = voiceChannel.id;
        await player.connect();
      }

      // Clear current queue if something is playing
      if (player.playing) {
        player.queue.tracks = [];
        await player.stopPlaying(false, false);
      }

      // Search Spotify for the artist's tracks
      const result = await player.search(
        { query: `${artist} top tracks`, source: 'spsearch' },
        interaction.user
      );

      if (!result.tracks.length) {
        return interaction.editReply(`Could not find any tracks for **${artist}**.`);
      }

      // Take up to 25 tracks and shuffle them
      const tracks = result.tracks.slice(0, 25);
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      }

      for (const track of tracks) {
        await player.queue.add(track);
      }

      // Set queue loop so it plays 24/7
      await player.setRepeatMode('queue');
      await player.setVolume(50);
      await player.play();

      await interaction.editReply(
        `📻 **${artist} Radio** — ${tracks.length} tracks queued on loop 🔁\nVolume: 50% • Use \`/loop off\` to stop looping`
      );
    } catch (error) {
      console.error('Radio error:', error);
      await interaction.editReply(`Could not start radio: ${error.message}`);
    }
  },
};
