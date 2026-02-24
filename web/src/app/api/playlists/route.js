import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'playlists.json');

function readPlaylists() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writePlaylists(playlists) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(playlists, null, 2));
}

export async function GET() {
  const playlists = readPlaylists();
  return NextResponse.json(playlists);
}

export async function POST(request) {
  const body = await request.json();
  const { name, description, tracks } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const playlists = readPlaylists();
  const id = String(Date.now());
  const playlist = {
    id,
    name,
    description: description || '',
    tracks: tracks || [],
    createdAt: new Date().toISOString(),
  };

  playlists.push(playlist);
  writePlaylists(playlists);

  return NextResponse.json(playlist, { status: 201 });
}
