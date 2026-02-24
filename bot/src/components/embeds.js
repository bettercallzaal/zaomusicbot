const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/formatDuration');

function nowPlayingEmbed(song) {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Now Playing')
    .setDescription(`[${song.name}](${song.url})`)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: 'Duration', value: formatDuration(song.duration), inline: true },
      { name: 'Requested by', value: `${song.user}`, inline: true },
    )
    .setTimestamp();
}

function addedToQueueEmbed(song) {
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('Added to Queue')
    .setDescription(`[${song.name}](${song.url})`)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: 'Duration', value: formatDuration(song.duration), inline: true },
      { name: 'Requested by', value: `${song.user}`, inline: true },
    );
}

function queueEmbed(queue, page = 0) {
  const songs = queue.songs;
  const itemsPerPage = 10;
  const pages = Math.ceil((songs.length - 1) / itemsPerPage) || 1;
  const current = songs[0];

  const start = page * itemsPerPage + 1;
  const end = Math.min(start + itemsPerPage, songs.length);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Queue')
    .setDescription(
      `**Now Playing:** [${current.name}](${current.url}) - \`${formatDuration(current.duration)}\`\n\n` +
      (songs.length > 1
        ? songs.slice(start, end).map((s, i) =>
            `**${start + i}.** [${s.name}](${s.url}) - \`${formatDuration(s.duration)}\` | ${s.user}`
          ).join('\n')
        : 'No more songs in queue.')
    )
    .setFooter({ text: `Page ${page + 1}/${pages} | ${songs.length} songs` });

  return embed;
}

function errorEmbed(message) {
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('Error')
    .setDescription(message);
}

module.exports = { nowPlayingEmbed, addedToQueueEmbed, queueEmbed, errorEmbed };
