const AUDIUS_API = 'https://api.audius.co/v1';
const APP_NAME = 'ZAOMusicBot';

async function searchTracks(query, limit = 10) {
  const url = `${AUDIUS_API}/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}&app_name=${APP_NAME}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audius search failed: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

function getStreamUrl(trackId) {
  // Return the stream endpoint directly — Lavalink follows the redirect itself
  return `${AUDIUS_API}/tracks/${trackId}/stream?app_name=${APP_NAME}`;
}

async function getPlaylist(playlistId) {
  const url = `${AUDIUS_API}/playlists/${playlistId}?app_name=${APP_NAME}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audius playlist fetch failed: ${res.status}`);
  const json = await res.json();
  // API returns an array, playlist is first element
  const playlist = Array.isArray(json.data) ? json.data[0] : json.data;
  return playlist;
}

/**
 * Resolves an audius.co URL. Uses redirect: 'manual' to read the
 * redirect location and determine if it's a track or playlist,
 * then fetches the appropriate endpoint.
 */
async function resolveUrl(audiusUrl) {
  const url = `${AUDIUS_API}/resolve?url=${encodeURIComponent(audiusUrl)}&app_name=${APP_NAME}`;
  const res = await fetch(url, { redirect: 'manual' });

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get('location');
    if (!location) throw new Error('Audius resolve returned redirect with no location');

    // Determine type from the redirect URL
    if (location.includes('/playlists/')) {
      const playlistId = location.split('/playlists/')[1].split('?')[0];
      const playlist = await getPlaylist(playlistId);
      return { type: 'playlist', data: playlist };
    } else if (location.includes('/tracks/')) {
      const trackId = location.split('/tracks/')[1].split('?')[0];
      const trackRes = await fetch(location.startsWith('http') ? location : `${AUDIUS_API}/tracks/${trackId}`);
      if (!trackRes.ok) throw new Error(`Audius track fetch failed: ${trackRes.status}`);
      const trackJson = await trackRes.json();
      return { type: 'track', data: trackJson.data };
    }

    // Fallback — follow the redirect
    const followRes = await fetch(location);
    if (!followRes.ok) throw new Error(`Audius resolve follow failed: ${followRes.status}`);
    const followJson = await followRes.json();
    return { type: 'track', data: Array.isArray(followJson.data) ? followJson.data[0] : followJson.data };
  }

  // No redirect — direct response
  if (!res.ok) throw new Error(`Audius resolve failed: ${res.status}`);
  const json = await res.json();
  const data = Array.isArray(json.data) ? json.data[0] : json.data;

  // Try to detect type from the data
  if (data.tracks || data.playlist_name) {
    return { type: 'playlist', data };
  }
  return { type: 'track', data };
}

function isAudiusUrl(query) {
  return /audius\.co\//.test(query);
}

function isAudiusSearch(query) {
  return query.startsWith('audius:');
}

function parseAudiusQuery(query) {
  return query.replace(/^audius:\s*/, '').trim();
}

module.exports = { searchTracks, getStreamUrl, getPlaylist, resolveUrl, isAudiusUrl, isAudiusSearch, parseAudiusQuery };
