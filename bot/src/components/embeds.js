const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/formatDuration');

function createProgressBar(position, duration, barLength = 12) {
  const progress = Math.min(position / duration, 1);
  const filledLength = Math.round(barLength * progress);
  const bar = '▬'.repeat(filledLength) + '🔘' + '▬'.repeat(barLength - filledLength);
  const elapsed = formatDuration(Math.floor(position / 1000));
  const total = formatDuration(Math.floor(duration / 1000));
  return `${bar} \`${elapsed} / ${total}\``;
}

function getActiveFilters(player) {
  const filterData = player.filterManager?.data || {};
  const filterNames = {
    equalizer: 'Bass Boost',
    timescale: null, // Determined below
    karaoke: 'Karaoke',
    tremolo: 'Tremolo',
    vibrato: 'Vibrato',
    rotation: 'Rotation',
    lowPass: 'Low Pass',
  };

  const active = [];
  for (const [key, label] of Object.entries(filterNames)) {
    if (filterData[key]) {
      if (key === 'timescale') {
        const ts = filterData[key];
        if (ts.speed >= 1.2) active.push('Nightcore');
        else if (ts.speed <= 0.9) active.push('Vaporwave');
        else active.push('Timescale');
      } else {
        active.push(label);
      }
    }
  }
  return active;
}

function getSourceIcon(uri) {
  if (!uri) return '🎵';
  if (uri.includes('youtube.com') || uri.includes('youtu.be')) return '▶️';
  if (uri.includes('spotify.com')) return '🟢';
  if (uri.includes('soundcloud.com')) return '🟠';
  if (uri.includes('deezer.com')) return '🟣';
  if (uri.includes('apple.com')) return '🍎';
  if (uri.includes('audius.co')) return '🎧';
  return '🎵';
}

function nowPlayingEmbed(track, player) {
  const info = track.info;
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Now Playing')
    .setDescription(`[${info.title}](${info.uri})`)
    .setThumbnail(info.artworkUrl || null)
    .setTimestamp();

  const fields = [
    { name: 'Duration', value: formatDuration(Math.floor(info.duration / 1000)), inline: true },
    { name: 'Author', value: info.author || 'Unknown', inline: true },
    { name: 'Requested by', value: track.requester ? `<@${track.requester.id}>` : 'Unknown', inline: true },
  ];

  // Add progress bar if player is provided
  if (player && info.duration > 0) {
    const position = player.position || 0;
    fields.push({ name: 'Progress', value: createProgressBar(position, info.duration), inline: false });
  }

  // Show active filters if player is provided
  if (player) {
    const filters = getActiveFilters(player);
    if (filters.length > 0) {
      fields.push({ name: 'Filters', value: filters.join(', '), inline: false });
    }
  }

  embed.addFields(...fields);
  return embed;
}

function addedToQueueEmbed(track, position) {
  const info = track.info;
  const icon = getSourceIcon(info.uri);
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`${icon} Added to Queue`)
    .setDescription(`[${info.title}](${info.uri})`)
    .setThumbnail(info.artworkUrl || null)
    .addFields(
      { name: 'Duration', value: formatDuration(Math.floor(info.duration / 1000)), inline: true },
      { name: 'Position in Queue', value: `#${position}`, inline: true },
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

module.exports = { nowPlayingEmbed, addedToQueueEmbed, queueEmbed, errorEmbed, getSourceIcon };
