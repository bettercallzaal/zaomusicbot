const { SlashCommandBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('save')
    .setDescription('Save the current queue as a website playlist')
    .addStringOption(opt =>
      opt.setName('name').setDescription('Playlist name').setRequired(true)
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) {
      return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    }

    const name = interaction.options.getString('name');
    await interaction.deferReply();

    try {
      // Collect all tracks (current + queue)
      const allTracks = [];
      if (player.queue.current) {
        const info = player.queue.current.info;
        allTracks.push({ title: info.title, query: info.title, url: info.uri || '' });
      }
      for (const track of player.queue.tracks) {
        const info = track.info;
        allTracks.push({ title: info.title, query: info.title, url: info.uri || '' });
      }

      const apiUrl = config.playlistApi.url;
      const headers = { 'Content-Type': 'application/json' };
      if (config.playlistApi.key) {
        headers['Authorization'] = `Bearer ${config.playlistApi.key}`;
      }

      const res = await fetch(`${apiUrl}/api/playlists`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          description: `Saved from Discord by ${interaction.user.username}`,
          tracks: allTracks,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return interaction.editReply(`Failed to save playlist: ${error.error || res.statusText}`);
      }

      const playlist = await res.json();
      await interaction.editReply(
        `Saved **${allTracks.length}** tracks as **${name}**!\nView at: ${apiUrl}/playlists/${playlist.id}`
      );
    } catch (error) {
      console.error('Save error:', error);
      await interaction.editReply(`Failed to save playlist: ${error.message}`);
    }
  },
};
