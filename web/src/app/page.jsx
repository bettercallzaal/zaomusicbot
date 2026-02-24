import Link from 'next/link';

async function getPlaylists() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/playlists`, { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  let playlists = [];
  try {
    playlists = await getPlaylists();
  } catch {
    // API not available during build
  }

  return (
    <div className="container">
      <div className="header">
        <h1>ZAOMusicBot</h1>
        <p>Browse and manage playlists for your Discord server</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Playlists</h2>
        <Link href="/playlists/new" className="btn">+ New Playlist</Link>
      </div>

      {playlists.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No playlists yet. Create one to get started!</p>
      ) : (
        playlists.map(p => (
          <Link key={p.id} href={`/playlists/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
              <h3>{p.name}</h3>
              <p className="meta">{p.tracks.length} tracks &middot; {p.description}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
