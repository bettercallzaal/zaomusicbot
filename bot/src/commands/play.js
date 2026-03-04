const { SlashCommandBuilder } = require('discord.js');
const { addedToQueueEmbed, getSourceIcon } = require('../components/embeds');
const audius = require('../services/audius');

async function loadAudiusTrack(player, audiusTrack, requester) {
  const streamUrl = audius.getStreamUrl(audiusTrack.id);
  const result = await player.search({ query: streamUrl }, requester);
  if (!result.tracks.length) return null;

  const track = result.tracks[0];
  track.info.title = audiusTrack.title;
  track.info.author = audiusTrack.user?.name || 'Unknown';
  track.info.uri = audiusTrack.permalink
    ? `https://audius.co${audiusTrack.permalink}`
    : 'https://audius.co';
  track.info.artworkUrl = audiusTrack.artwork?.['480x480'] || audiusTrack.artwork?.['150x150'] || null;
  if (audiusTrack.duration) {
    track.info.duration = audiusTrack.duration * 1000;
  }
  return track;
}

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
      const isNewPlayer = !player;
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

      // --- Audius handling ---
      if (audius.isAudiusUrl(query) || audius.isAudiusSearch(query)) {
        if (audius.isAudiusUrl(query)) {
          const resolved = await audius.resolveUrl(query);

          if (resolved.type === 'playlist') {
            const playlist = resolved.data;
            const tracks = playlist.tracks || [];
            if (!tracks.length) return interaction.editReply('Audius playlist is empty.');

            await interaction.editReply(`🎧 Loading **${playlist.playlist_name}** — ${tracks.length} tracks from Audius...`);

            let loaded = 0;
            const BATCH_SIZE = 5;
            for (let i = 0; i < tracks.length; i += BATCH_SIZE) {
              const batch = tracks.slice(i, i + BATCH_SIZE);
              const results = await Promise.allSettled(
                batch.map(t => loadAudiusTrack(player, t, interaction.user))
              );
              for (const result of results) {
                if (result.status === 'fulfilled' && result.value) {
                  await player.queue.add(result.value);
                  loaded++;
                  if (loaded === 1 && !player.playing) {
                    if (isNewPlayer) await player.setVolume(10);
                    await player.play();
                  }
                }
              }
            }

            const channel = interaction.channel;
            if (channel) {
              channel.send(`🎧 Loaded **${playlist.playlist_name}** — ${loaded}/${tracks.length} tracks queued from Audius`);
            }
            return;
          }

          // Single Audius track
          const track = await loadAudiusTrack(player, resolved.data, interaction.user);
          if (!track) return interaction.editReply('Could not load Audius stream.');

          await player.queue.add(track);

          if (player.queue.tracks.length > 0 && player.playing) {
            const position = player.queue.tracks.length;
            const embed = addedToQueueEmbed(track, position);
            await interaction.editReply({ embeds: [embed] });
          } else {
            await interaction.editReply(`🎧 Playing **${track.info.title}** by ${track.info.author} (Audius)`);
          }

          if (!player.playing) {
            if (isNewPlayer) await player.setVolume(10);
            await player.play();
          }
          return;
        }

        // Audius search
        const searchQuery = audius.parseAudiusQuery(query);
        const results = await audius.searchTracks(searchQuery, 1);
        if (!results.length) return interaction.editReply('No Audius results found.');

        const track = await loadAudiusTrack(player, results[0], interaction.user);
        if (!track) return interaction.editReply('Could not load Audius stream.');

        await player.queue.add(track);

        if (player.queue.tracks.length > 0 && player.playing) {
          const position = player.queue.tracks.length;
          const embed = addedToQueueEmbed(track, position);
          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply(`🎧 Playing **${track.info.title}** by ${track.info.author} (Audius)`);
        }

        if (!player.playing) {
          if (isNewPlayer) await player.setVolume(10);
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
        if (isNewPlayer) await player.setVolume(10);
        await player.play();
      }
    } catch (error) {
      console.error('Play error:', error);
      await interaction.editReply(`Could not play: ${error.message}`);
    }
  },
};
