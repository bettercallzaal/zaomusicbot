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

export async function GET(request, { params }) {
  const { id } = await params;
  const playlists = readPlaylists();
  const playlist = playlists.find(p => p.id === id);
  if (!playlist) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(playlist);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const playlists = readPlaylists();
  const index = playlists.findIndex(p => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  playlists[index] = {
    ...playlists[index],
    name: body.name ?? playlists[index].name,
    description: body.description ?? playlists[index].description,
    tracks: body.tracks ?? playlists[index].tracks,
  };

  writePlaylists(playlists);
  return NextResponse.json(playlists[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const playlists = readPlaylists();
  const index = playlists.findIndex(p => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  playlists.splice(index, 1);
  writePlaylists(playlists);
  return NextResponse.json({ success: true });
}
