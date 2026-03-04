const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/formatDuration');

function getSourceIcon(uri) {
  if (!uri) return '🎵';
  if (uri.includes('youtube.com') || uri.includes('youtu.be')) return '▶️';
  if (uri.includes('spotify.com')) return '🟢';
  if (uri.includes('soundcloud.com')) return '🟠';
  if (uri.includes('audius.co')) return '🎧';
  if (uri.includes('bandcamp.com')) return '🔵';
  if (uri.includes('twitch.tv')) return '🟣';
  return '🎵';
}

function getActiveFilters(player) {
  const filterData = player.filterManager?.data;
  if (!filterData) return [];
  const names = { timescale: 'Timescale', karaoke: 'Karaoke', tremolo: 'Tremolo', vibrato: 'Vibrato', rotation: 'Rotation', lowPass: 'Low Pass' };
  const active = [];
  for (const [key, label] of Object.entries(names)) {
    const val = filterData[key];
    if (!val || (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0)) continue;
    active.push(label);
  }
  if (filterData.equalizer || (player.filterManager?.equalizerBands?.length > 0)) {
    active.push('Equalizer');
  }
  return active;
}

function nowPlayingEmbed(track, player) {
  const info = track.info;
  const icon = getSourceIcon(info.uri);
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Now Playing')
    .setDescription(`${icon} [${info.title}](${info.uri})`)
    .setThumbnail(info.artworkUrl || null)
    .addFields(
      { name: 'Duration', value: formatDuration(Math.floor(info.duration / 1000)), inline: true },
      { name: 'Author', value: info.author || 'Unknown', inline: true },
      { name: 'Requested by', value: track.requester ? `<@${track.requester.id}>` : 'Unknown', inline: true },
    );

  if (player) {
    const pos = player.position || 0;
    const dur = info.duration || 0;
    const progress = dur > 0 ? Math.round((pos / dur) * 20) : 0;
    const bar = '▬'.repeat(progress) + '🔘' + '▬'.repeat(20 - progress);
    embed.addFields({ name: 'Progress', value: `${bar}\n\`${formatDuration(Math.floor(pos / 1000))} / ${formatDuration(Math.floor(dur / 1000))}\`` });

    const filters = getActiveFilters(player);
    if (filters.length > 0) {
      embed.addFields({ name: 'Filters', value: filters.join(', ') });
    }
  }

  embed.setTimestamp();
  return embed;
}

function addedToQueueEmbed(track, position) {
  const info = track.info;
  const icon = getSourceIcon(info.uri);
  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('Added to Queue')
    .setDescription(`${icon} [${info.title}](${info.uri})`)
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
  const icon = currentInfo ? getSourceIcon(currentInfo.uri) : '🎵';
  const description = currentInfo
    ? `**Now Playing:** ${icon} [${currentInfo.title}](${currentInfo.uri}) - \`${formatDuration(Math.floor(currentInfo.duration / 1000))}\`\n\n`
    : '';

  const queueList = tracks.length > 0
    ? tracks.slice(start, end).map((t, i) => {
        const tIcon = getSourceIcon(t.info.uri);
        return `**${start + i + 1}.** ${tIcon} [${t.info.title}](${t.info.uri}) - \`${formatDuration(Math.floor(t.info.duration / 1000))}\``;
      }).join('\n')
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
