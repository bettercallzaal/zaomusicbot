'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [playlist, setPlaylist] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/playlists/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setPlaylist(data))
      .catch(() => router.push('/'));
  }, [id, router]);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/playlists/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to delete playlist');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (!playlist) {
    return (
      <div className="container">
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">&larr; Back to playlists</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>{playlist.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{playlist.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <Link
            href={`/playlists/${id}/edit`}
            className="btn"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              background: 'var(--danger)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--danger)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{ marginBottom: '0.75rem' }}>
            Are you sure you want to delete <strong>{playlist.name}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
