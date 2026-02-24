'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPlaylist() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tracksText, setTracksText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const tracks = tracksText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const isUrl = line.startsWith('http');
        return { title: isUrl ? '' : line, query: line, url: isUrl ? line : '' };
      });

    const res = await fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, tracks }),
    });

    if (res.ok) {
      const playlist = await res.json();
      router.push(`/playlists/${playlist.id}`);
    } else {
      alert('Failed to create playlist');
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">&larr; Back to playlists</Link>
      <h1 style={{ marginBottom: '1.5rem' }}>New Playlist</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="My Playlist" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="A great mix of songs" />
        </div>

        <div className="form-group">
          <label>Tracks (one per line — song name or URL)</label>
          <textarea
            value={tracksText}
            onChange={e => setTracksText(e.target.value)}
            rows={8}
            placeholder={"Never Gonna Give You Up\nhttps://youtube.com/watch?v=...\nBohemian Rhapsody"}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Playlist'}
        </button>
      </form>
    </div>
  );
}
