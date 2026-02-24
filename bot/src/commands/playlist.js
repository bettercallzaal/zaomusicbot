const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchPlaylists, findPlaylistByName } = require('../utils/playlistClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Website playlist commands')
    .addSubcommand(sub =>
      sub.setName('list').setDescription('List all playlists')
    )
    .addSubcommand(sub =>
      sub.setName('load').setDescription('Load a playlist into the queue')
        .addStringOption(opt =>
          opt.setName('name').setDescription('Playlist name').setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list') {
      await interaction.deferReply();
      try {
        const playlists = await fetchPlaylists();
        if (!playlists.length) {
          return interaction.editReply('No playlists found.');
        }

        const embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle('Playlists')
          .setDescription(
            playlists.map((p, i) => `**${i + 1}.** ${p.name} (${p.tracks.length} tracks)`).join('\n')
          );

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Playlist list error:', error);
        await interaction.editReply('Failed to fetch playlists.');
      }
    }

    if (sub === 'load') {
      const voiceChannel = interaction.member.voice?.channel;
      if (!voiceChannel) {
        return interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
      }

      const name = interaction.options.getString('name');
      await interaction.deferReply();

      try {
        const playlist = await findPlaylistByName(name);
        if (!playlist) {
          return interaction.editReply(`Playlist **${name}** not found.`);
        }

        if (!playlist.tracks.length) {
          return interaction.editReply(`Playlist **${name}** is empty.`);
        }

        await interaction.editReply(`Loading **${playlist.name}** (${playlist.tracks.length} tracks)...`);

        for (const track of playlist.tracks) {
          try {
            await interaction.client.distube.play(voiceChannel, track.url || track.query, {
              textChannel: interaction.channel,
              member: interaction.member,
            });
          } catch (e) {
            console.error(`Failed to load track: ${track.url || track.query}`, e.message);
          }
        }
      } catch (error) {
        console.error('Playlist load error:', error);
        await interaction.editReply('Failed to load playlist.');
      }
    }
  },
};
