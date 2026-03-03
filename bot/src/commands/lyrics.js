const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Show lyrics for the current song')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Song name (defaults to current song)')
    ),

  async execute(interaction) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    const query = interaction.options.getString('query');

    let searchTitle;
    if (query) {
      searchTitle = query;
    } else if (player?.queue?.current) {
      const info = player.queue.current.info;
      // Clean up title for better search results
      searchTitle = info.title
        .replace(/\(official.*?\)/gi, '')
        .replace(/\[official.*?\]/gi, '')
        .replace(/\(lyrics.*?\)/gi, '')
        .replace(/\[lyrics.*?\]/gi, '')
        .replace(/\(audio.*?\)/gi, '')
        .replace(/\[audio.*?\]/gi, '')
        .replace(/\(music video.*?\)/gi, '')
        .replace(/\[music video.*?\]/gi, '')
        .replace(/\|.*$/, '')
        .trim();
    } else {
      return interaction.reply({ content: 'Nothing is playing. Provide a song name with `/lyrics <query>`.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      // Split title into artist and song if possible
      let artist = '';
      let title = searchTitle;
      if (searchTitle.includes(' - ')) {
        const parts = searchTitle.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      const url = artist
        ? `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
        : `https://api.lyrics.ovh/v1/${encodeURIComponent(title)}/${encodeURIComponent(title)}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        return interaction.editReply(`No lyrics found for **${searchTitle}**.`);
      }

      const data = await res.json();
      const lyrics = data.lyrics?.trim();

      if (!lyrics) {
        return interaction.editReply(`No lyrics found for **${searchTitle}**.`);
      }

      // Paginate if lyrics are too long for one embed (4096 char limit)
      const chunks = [];
      const maxLen = 3900;
      let remaining = lyrics;
      while (remaining.length > 0) {
        if (remaining.length <= maxLen) {
          chunks.push(remaining);
          break;
        }
        // Try to split at a newline near the limit
        let splitIndex = remaining.lastIndexOf('\n', maxLen);
        if (splitIndex === -1 || splitIndex < maxLen / 2) splitIndex = maxLen;
        chunks.push(remaining.slice(0, splitIndex));
        remaining = remaining.slice(splitIndex).trimStart();
      }

      const embeds = chunks.map((chunk, i) =>
        new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle(i === 0 ? `Lyrics — ${searchTitle}` : `Lyrics (cont.)`)
          .setDescription(chunk)
          .setFooter(chunks.length > 1 ? { text: `Page ${i + 1}/${chunks.length}` } : null)
      );

      // Discord allows up to 10 embeds per message
      await interaction.editReply({ embeds: embeds.slice(0, 10) });
    } catch (error) {
      if (error.name === 'AbortError') {
        return interaction.editReply('Lyrics request timed out. Try again later.');
      }
      console.error('Lyrics error:', error);
      await interaction.editReply(`No lyrics found for **${searchTitle}**.`);
    }
  },
};
