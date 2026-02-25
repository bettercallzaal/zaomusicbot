const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/formatDuration');

function nowPlayingEmbed(track) {
  const info = track.info;
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Now Playing')
    .setDescription(`[${info.title}](${info.uri})`)
    .setThumbnail(info.artworkUrl || null)
    .addFields(
      { name: 'Duration', value: formatDuration(Math.floor(info.duration / 1000)), inline: true },
      { name: 'Author', value: info.author || 'Unknown', inline: true },
      { name: 'Requested by', value: track.requester ? `<@${track.requester.id}>` : 'Unknown', inline: true },
    )
    .setTimestamp();
}

function addedToQueueEmbed(track, position) {
  const info = track.info;
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('Added to Queue')
    .setDescription(`[${info.title}](${info.uri})`)
    .setThumbnail(info.artworkUrl || null)
    .addFields(
      { name: 'Duration', value: formatDuration(Math.floor(info.duration / 1000)), inline: true },
      { name: 'Position', value: `#${position}`, inline: true },
    );
}

function queueEmbed(player, page = 0) {
  const queue = player.queue;
  const current = queue.current;
  const tracks = queue.tracks;
  const itemsPerPage = 10;
  const pages = Math.ceil(tracks.length / itemsPerPage) || 1;

  const start = page * itemsPerPage;
  const end = Math.min(start + itemsPerPage, tracks.length);

  const currentInfo = current?.info;
  const description = currentInfo
    ? `**Now Playing:** [${currentInfo.title}](${currentInfo.uri}) - \`${formatDuration(Math.floor(currentInfo.duration / 1000))}\`\n\n`
    : '';

  const queueList = tracks.length > 0
    ? tracks.slice(start, end).map((t, i) =>
        `**${start + i + 1}.** [${t.info.title}](${t.info.uri}) - \`${formatDuration(Math.floor(t.info.duration / 1000))}\``
      ).join('\n')
    : 'No more songs in queue.';

  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Queue')
    .setDescription(description + queueList)
    .setFooter({ text: `Page ${page + 1}/${pages} | ${tracks.length + (current ? 1 : 0)} songs` });
}

function errorEmbed(message) {
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('Error')
    .setDescription(message);
}

module.exports = { nowPlayingEmbed, addedToQueueEmbed, queueEmbed, errorEmbed };
