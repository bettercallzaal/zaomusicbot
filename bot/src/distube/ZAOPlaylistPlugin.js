const { ExtractorPlugin } = require('distube');
const config = require('../config');

class ZAOPlaylistPlugin extends ExtractorPlugin {
  constructor() {
    super();
  }

  validate(url) {
    const base = config.playlistApi.url;
    return typeof url === 'string' && url.startsWith(`${base}/playlists/`);
  }

  async resolve(url, { member, metadata }) {
    const id = url.split('/playlists/')[1];
    const headers = { 'Content-Type': 'application/json' };
    if (config.playlistApi.key) headers['x-api-key'] = config.playlistApi.key;

    const res = await fetch(`${config.playlistApi.url}/api/playlists/${id}`, { headers });
    if (!res.ok) throw new Error(`Playlist not found (${res.status})`);
    const playlist = await res.json();

    return {
      source: 'zao-playlist',
      songs: playlist.tracks.map(t => ({
        name: t.title || t.query,
        url: t.url || t.query,
      })),
      name: playlist.name,
    };
  }
}

module.exports = { ZAOPlaylistPlugin };
