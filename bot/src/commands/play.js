const { SlashCommandBuilder } = require('discord.js');
const { addedToQueueEmbed, getSourceIcon } = require('../components/embeds');
const audius = require('../services/audius');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add it to the queue')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Song name, URL, or audius:search').setRequired(true)
    ),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    }

    const query = interaction.options.getString('query');
    await interaction.deferReply();

    try {
      let player = interaction.client.lavalink.getPlayer(interaction.guildId);
      if (!player) {
        player = interaction.client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          volume: 10,
        });
        await player.connect();
        await player.setVolume(10);
      } else if (player.voiceChannelId !== voiceChannel.id) {
        player.voiceChannelId = voiceChannel.id;
        await player.connect();
      }

      // --- Audius handling ---
      if (audius.isAudiusUrl(query) || audius.isAudiusSearch(query)) {
        let audiusTrack;

        if (audius.isAudiusUrl(query)) {
          audiusTrack = await audius.resolveUrl(query);
        } else {
          const searchQuery = audius.parseAudiusQuery(query);
          const results = await audius.searchTracks(searchQuery, 1);
          if (!results.length) return interaction.editReply('No Audius results found.');
          audiusTrack = results[0];
        }

        if (!audiusTrack || !audiusTrack.id) {
          return interaction.editReply('Could not resolve Audius track.');
        }

        const streamUrl = await audius.getStreamUrl(audiusTrack.id);
        const result = await player.search({ query: streamUrl }, interaction.user);

        if (!result.tracks.length) {
          return interaction.editReply('Could not load Audius stream.');
        }

        const track = result.tracks[0];
        // Patch metadata with Audius info
        track.info.title = audiusTrack.title;
        track.info.author = audiusTrack.user?.name || 'Unknown';
        track.info.uri = `https://audius.co${audiusTrack.permalink}`;
        track.info.artworkUrl = audiusTrack.artwork?.['480x480'] || audiusTrack.artwork?.['150x150'] || null;
        if (audiusTrack.duration) {
          track.info.duration = audiusTrack.duration * 1000; // Audius uses seconds, Lavalink uses ms
        }

        await player.queue.add(track);

        if (player.queue.tracks.length > 0 && player.playing) {
          const position = player.queue.tracks.length;
          const embed = addedToQueueEmbed(track, position);
          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply(`🎧 Playing **${track.info.title}** by ${track.info.author} (Audius)`);
        }

        if (!player.playing) {
          await player.play();
        }
        return;
      }

      // --- Standard Lavalink handling ---
      const result = await player.search({ query }, interaction.user);

      if (!result.tracks.length) {
        return interaction.editReply('No results found.');
      }

      if (result.loadType === 'playlist') {
        for (const track of result.tracks) {
          await player.queue.add(track);
        }
        const icon = getSourceIcon(result.tracks[0]?.info?.uri);
        await interaction.editReply(`${icon} Added **${result.playlist?.name || 'playlist'}** (${result.tracks.length} tracks) to the queue.`);
      } else {
        const track = result.tracks[0];
        const icon = getSourceIcon(track.info.uri);
        await player.queue.add(track);
        if (player.queue.tracks.length > 0 && player.playing) {
          const position = player.queue.tracks.length;
          const embed = addedToQueueEmbed(track, position);
          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply(`${icon} Playing **${track.info.title}**`);
        }
      }

      if (!player.playing) {
        await player.play();
      }
    } catch (error) {
      console.error('Play error:', error);
      await interaction.editReply(`Could not play: ${error.message}`);
    }
  },
};
