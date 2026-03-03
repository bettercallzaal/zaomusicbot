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
      return [];
    }
    throw error;
  }
}

function writePlaylists(playlists) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(playlists, null, 2));
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const playlists = readPlaylists();
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(playlist);
  } catch (error) {
    console.error('GET /api/playlists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to read playlist' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
      return NextResponse.json({ error: 'Name must be a non-empty string' }, { status: 400 });
    }

    if (body.tracks !== undefined && !Array.isArray(body.tracks)) {
      return NextResponse.json({ error: 'Tracks must be an array' }, { status: 400 });
    }

    const playlists = readPlaylists();
    const index = playlists.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    playlists[index] = {
      ...playlists[index],
      name: body.name?.trim() ?? playlists[index].name,
      description: body.description ?? playlists[index].description,
      tracks: body.tracks ?? playlists[index].tracks,
    };

    writePlaylists(playlists);
    return NextResponse.json(playlists[index]);
  } catch (error) {
    console.error('PUT /api/playlists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update playlist' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const playlists = readPlaylists();
    const index = playlists.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    playlists.splice(index, 1);
    writePlaylists(playlists);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/playlists/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
  }
}
