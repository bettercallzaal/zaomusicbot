const { SlashCommandBuilder } = require('discord.js');

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
    await interaction.reply({ content: `🔍 Searching for **${query}**...` });

    try {
      await interaction.client.distube.play(voiceChannel, query, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
    } catch (error) {
      console.error('Play error:', error);
      await interaction.editReply({ content: `Could not play: ${error.message}` });
    }
  },
};
