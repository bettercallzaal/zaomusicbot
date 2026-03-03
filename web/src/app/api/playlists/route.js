import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'playlists.json');

function readPlaylists() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]');
      return [];
    }
    throw error;
  }
}

function writePlaylists(playlists) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(playlists, null, 2));
}

export async function GET() {
  try {
    const playlists = readPlaylists();
    return NextResponse.json(playlists);
  } catch (error) {
    console.error('GET /api/playlists error:', error);
    return NextResponse.json({ error: 'Failed to read playlists' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, tracks } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (tracks !== undefined && !Array.isArray(tracks)) {
      return NextResponse.json({ error: 'Tracks must be an array' }, { status: 400 });
    }

    const playlists = readPlaylists();
    const id = String(Date.now());
    const playlist = {
      id,
      name: name.trim(),
      description: description || '',
      tracks: tracks || [],
      createdAt: new Date().toISOString(),
    };

    playlists.push(playlist);
    writePlaylists(playlists);

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    console.error('POST /api/playlists error:', error);
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}
