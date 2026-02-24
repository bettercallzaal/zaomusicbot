const { Events } = require('distube');
const { nowPlayingEmbed, addedToQueueEmbed, errorEmbed } = require('../components/embeds');
const { createPlayerRow } = require('../components/playerButtons');

function loadDistubeEvents(distube) {
  distube.on(Events.PLAY_SONG, (queue, song) => {
    const embed = nowPlayingEmbed(song);
    const row = createPlayerRow();
    queue.textChannel?.send({ embeds: [embed], components: [row] });
  });

  distube.on(Events.ADD_SONG, (queue, song) => {
    const embed = addedToQueueEmbed(song);
    queue.textChannel?.send({ embeds: [embed] });
  });

  distube.on(Events.ADD_LIST, (queue, playlist) => {
    queue.textChannel?.send({
      embeds: [{
        color: 0x57f287,
        title: 'Playlist Added',
        description: `**${playlist.name}** - ${playlist.songs.length} songs added to queue`,
      }],
    });
  });

  distube.on(Events.FINISH, (queue) => {
    queue.textChannel?.send({ embeds: [{ color: 0x5865f2, description: 'Queue finished. Add more songs or I\'ll leave soon.' }] });
  });

  distube.on(Events.EMPTY, (queue) => {
    queue.textChannel?.send({ embeds: [{ color: 0xfee75c, description: 'Voice channel is empty. Leaving...' }] });
  });

  distube.on(Events.ERROR, (error, queue, song) => {
    console.error('DisTube error:', error);
    const msg = song
      ? `Error playing **${song.name}**: ${error.message}`
      : `Error: ${error.message}`;
    queue.textChannel?.send({ embeds: [errorEmbed(msg)] });
  });

  console.log('Loaded DisTube events');
}

module.exports = { loadDistubeEvents };
