const AUDIUS_API = 'https://api.audius.co/v1';

async function searchTracks(query, limit = 10) {
  const url = `${AUDIUS_API}/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audius search failed: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

async function getTrack(trackId) {
  const url = `${AUDIUS_API}/tracks/${trackId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audius track fetch failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function getStreamUrl(trackId) {
  const url = `${AUDIUS_API}/tracks/${trackId}/stream?no_redirect=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audius stream failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function resolveUrl(audiusUrl) {
  const url = `${AUDIUS_API}/resolve?url=${encodeURIComponent(audiusUrl)}`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Audius resolve failed: ${res.status}`);
  const json = await res.json();
  return json.data;
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

module.exports = { searchTracks, getTrack, getStreamUrl, resolveUrl, isAudiusUrl, isAudiusSearch, parseAudiusQuery };
