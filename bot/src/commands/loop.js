const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set loop mode')
    .addStringOption(opt =>
      opt.setName('mode').setDescription('Loop mode').setRequired(true)
        .addChoices(
          { name: 'Off', value: 'off' },
          { name: 'Song', value: 'track' },
          { name: 'Queue', value: 'queue' },
        )
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player || !player.queue.current) return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
    const mode = interaction.options.getString('mode');
    await player.setRepeatMode(mode);
    const labels = { off: 'Off', track: 'Song', queue: 'Queue' };
    await interaction.reply(`🔁 Loop mode: **${labels[mode]}**`);
  },
};
