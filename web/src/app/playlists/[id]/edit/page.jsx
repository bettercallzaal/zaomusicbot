'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPlaylist() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/playlists/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setName(data.name);
        setDescription(data.description || '');
        setTracks(data.tracks || []);
        setLoading(false);
      })
      .catch(() => {
        router.push('/');
      });
  }, [id, router]);

  function addTrack() {
    setTracks([...tracks, { title: '', url: '', query: '' }]);
  }

  function removeTrack(index) {
    setTracks(tracks.filter((_, i) => i !== index));
  }

  function updateTrack(index, field, value) {
    const updated = [...tracks];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'title') updated[index].query = value;
    setTracks(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, tracks }),
    });

    if (res.ok) {
      router.push(`/playlists/${id}`);
    } else {
      alert('Failed to save playlist');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href={`/playlists/${id}`} className="back-link">&larr; Back to playlist</Link>
      <h1 style={{ marginBottom: '1.5rem' }}>Edit Playlist</h1>

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
          <label>Tracks</label>
          <div style={{ marginTop: '0.5rem' }}>
            {tracks.map((track, i) => (
              <div key={i} style={{
                display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-muted)', minWidth: '1.5rem', fontWeight: 600 }}>{i + 1}</span>
                <input
                  value={track.title || track.query || ''}
                  onChange={e => updateTrack(i, 'title', e.target.value)}
                  placeholder="Song title"
                  style={{ flex: 1 }}
                />
                <input
                  value={track.url || ''}
                  onChange={e => updateTrack(i, 'url', e.target.value)}
                  placeholder="URL (optional)"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeTrack(i)}
                  style={{
                    background: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.6rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTrack}
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px dashed var(--border)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              marginTop: '0.25rem',
              fontSize: '0.9rem',
            }}
          >
            + Add Track
          </button>
        </div>

        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
