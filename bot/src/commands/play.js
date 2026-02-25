const { SlashCommandBuilder } = require('discord.js');
const { addedToQueueEmbed } = require('../components/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add it to the queue')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Song name or URL').setRequired(true)
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
        });
        await player.connect();
      } else if (player.voiceChannelId !== voiceChannel.id) {
        // Move to user's channel if different
        player.voiceChannelId = voiceChannel.id;
        await player.connect();
      }

      const result = await player.search({ query }, interaction.user);

      if (!result.tracks.length) {
        return interaction.editReply('No results found.');
      }

      if (result.loadType === 'playlist') {
        for (const track of result.tracks) {
          await player.queue.add(track);
        }
        await interaction.editReply(`Added **${result.playlist?.name || 'playlist'}** (${result.tracks.length} tracks) to the queue.`);
      } else {
        const track = result.tracks[0];
        await player.queue.add(track);
        if (player.queue.tracks.length > 0 && player.playing) {
          const embed = addedToQueueEmbed(track, player.queue.tracks.length);
          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply(`🔍 Playing **${track.info.title}**`);
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
