const config = require('../config');

const BASE = config.playlistApi.url;
const KEY = config.playlistApi.key;

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (KEY) h['x-api-key'] = KEY;
  return h;
}

async function fetchPlaylists() {
  const res = await fetch(`${BASE}/api/playlists`, { headers: headers() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function fetchPlaylist(id) {
  const res = await fetch(`${BASE}/api/playlists/${id}`, { headers: headers() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function findPlaylistByName(name) {
  const playlists = await fetchPlaylists();
  return playlists.find(p => p.name.toLowerCase() === name.toLowerCase());
}

module.exports = { fetchPlaylists, fetchPlaylist, findPlaylistByName };
