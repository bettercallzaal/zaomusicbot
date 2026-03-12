const { SlashCommandBuilder } = require('discord.js');

const LOFI_QUERIES = [
  'lofi hip hop chill beats',
  'lofi jazz study music',
  'chillhop beats instrumental',
  'lofi rain vibes study',
  'lofi aesthetic chill mix',
  'lofi piano relaxing beats',
  'lofi cafe music instrumental',
  'japanese lofi hip hop',
  'lofi sleep beats calm',
  'lofi guitar chill instrumental',
  'chillwave lofi beats',
  'lofi summer vibes mix',
  'lofi ambient study beats',
  'lofi R&B chill mix',
  'lofi night drive beats',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lofi')
    .setDescription('Queue a shuffled lofi playlist at low volume'),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    }

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

      // Pick 8 random queries and search for tracks
      const queries = shuffle(LOFI_QUERIES).slice(0, 8);
      const tracks = [];

      for (const query of queries) {
        try {
          const result = await player.search({ query, source: 'ytsearch' }, interaction.user);
          if (result.tracks.length) {
            // Take the top result from each search
            tracks.push(result.tracks[0]);
          }
        } catch {
          // Skip failed searches
        }
      }

      if (!tracks.length) {
        return interaction.editReply('Could not find any lofi tracks.');
      }

      // Shuffle the collected tracks and queue them
      const shuffled = shuffle(tracks);
      for (const track of shuffled) {
        await player.queue.add(track);
      }

      await player.setVolume(5);

      if (!player.playing) {
        await player.play();
      }

      await interaction.editReply(`🎶 **Lofi Playlist** — queued ${shuffled.length} chill tracks at 5% volume`);
    } catch (error) {
      console.error('Lofi error:', error);
      await interaction.editReply(`Could not start lofi: ${error.message}`);
    }
  },
};
