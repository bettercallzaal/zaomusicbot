import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPlaylist(id) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/playlists/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PlaylistPage({ params }) {
  const { id } = await params;
  const playlist = await getPlaylist(id);
  if (!playlist) notFound();

  return (
    <div className="container">
      <Link href="/" className="back-link">&larr; Back to playlists</Link>
      <h1 style={{ marginBottom: '0.25rem' }}>{playlist.name}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{playlist.description}</p>

      <h3>{playlist.tracks.length} Tracks</h3>
      <ul className="track-list">
        {playlist.tracks.map((track, i) => (
          <li key={i}>
            <span className="num">{i + 1}</span>
            <div>
              <strong>{track.title || track.query}</strong>
              {track.url && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{track.url}</div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {playlist.tracks.length === 0 && (
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>This playlist has no tracks yet.</p>
      )}
    </div>
  );
}
