# ZAOMusicBot v2.0.0

A feature-rich Discord music bot powered by **Lavalink** and **discord.js v14**, with a **Next.js** playlist management web UI.

## Features

### Music Playback
- Play from YouTube, Spotify, SoundCloud, Deezer, and more via Lavalink
- Queue management with shuffle, loop (track/queue), and autoplay
- Audio filters: Bass Boost, Nightcore, Vaporwave, Karaoke, Tremolo, Vibrato, Rotation, Low Pass
- Now-playing embed with progress bar and active filters display
- Source icons showing where tracks come from

### Commands

| Command | Description | DJ Only |
|---------|-------------|---------|
| `/play <query>` | Play a song or URL | No |
| `/pause` | Pause playback | Yes |
| `/resume` | Resume playback | Yes |
| `/skip` | Skip current song (vote skip for non-DJ) | No |
| `/stop` | Stop and clear queue | Yes |
| `/seek <seconds>` | Seek to position (with bounds checking) | No |
| `/queue [page]` | Show queue with pagination buttons | No |
| `/nowplaying` | Show current song with progress bar | No |
| `/shuffle` | Shuffle the queue | No |
| `/remove <pos>` | Remove a track from queue | Yes |
| `/move <from> <to>` | Reorder a track in the queue | Yes |
| `/clear` | Clear queue without stopping current song | Yes |
| `/loop <off/song/queue>` | Set loop mode | No |
| `/autoplay` | Toggle autoplay | Yes |
| `/volume <1-100>` | Set volume | Yes |
| `/filter <name>` | Toggle audio filter | Yes |
| `/playlist list` | List all website playlists | No |
| `/playlist load <name>` | Load a playlist into queue | No |
| `/save <name>` | Save current queue as a website playlist | No |
| `/lyrics [query]` | Show lyrics for current or given song | No |
| `/help` | Show all commands | No |

### Vote Skip
When a non-DJ user runs `/skip`, a vote is initiated. Over 50% of voice channel members must vote yes to skip. DJs always skip instantly.

### Web UI
- Browse and view playlists
- Create playlists with individual track rows (title + URL)
- Edit playlists — add, remove, and reorder tracks
- Delete playlists with confirmation dialog

## Project Structure

```
ZAOMusicBot/
├── bot/                    # Discord bot (Node.js)
│   └── src/
│       ├── commands/       # Slash commands
│       ├── components/     # Embeds & button builders
│       ├── events/         # Discord event handlers
│       ├── lavalink/       # Lavalink event setup
│       ├── utils/          # Helpers (DJ perms, formatting)
│       ├── config.js       # Config with startup validation
│       ├── index.js        # Entry point with graceful shutdown
│       └── deploy-commands.js
├── web/                    # Next.js playlist web UI
│   ├── src/app/
│   │   ├── api/playlists/  # REST API routes
│   │   └── playlists/      # UI pages (view, create, edit)
│   └── data/playlists.json
├── lavalink/               # Lavalink server
│   ├── application.yml
│   └── Lavalink.jar
└── package.json            # Workspace root
```

## Setup

### Prerequisites
- Node.js 18+
- Java 17+ (for Lavalink)
- A Discord bot application with token

### 1. Clone and install

```bash
git clone <repo-url>
cd ZAOMusicBot
npm install
```

### 2. Configure environment

Copy `.env.example` to `bot/.env` and fill in:

```env
# Required
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_bot_client_id

# Optional
GUILD_ID=your_dev_server_id        # For faster command registration
DJ_ROLE_ID=your_dj_role_id         # Omit = everyone is DJ

# Lavalink
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=zaomusicbot

# Playlist integration
PLAYLIST_API_URL=http://localhost:3000
PLAYLIST_API_KEY=
```

The bot validates required vars on startup and warns about missing optional ones.

### 3. Start Lavalink

```bash
npm run lavalink
```

### 4. Deploy slash commands

```bash
npm run deploy-commands
```

### 5. Start the bot

```bash
npm run dev:bot
```

### 6. Start the web UI

```bash
npm run dev:web
```

## What's New in v2.0.0

### Bug Fixes
- Fixed voice disconnect — bot now properly leaves when channel empties (was referencing removed DisTube)
- Added startup config validation with clear error messages
- API routes wrapped in try-catch with proper error responses and input validation
- Graceful shutdown on `SIGINT`/`SIGTERM` — destroys all players cleanly

### UX Improvements
- Now-playing embed shows visual progress bar: `▬▬▬🔘▬▬▬▬▬▬ 1:23 / 3:45`
- Active audio filters displayed on now-playing embed
- Queue has interactive Prev/Next pagination buttons
- Play command shows source icons and queue position
- Seek validates against track duration and shows position info

### New Commands
- `/lyrics` — fetch and display lyrics with pagination
- `/move <from> <to>` — reorder tracks in queue (DJ)
- `/save <name>` — save current queue as a website playlist
- `/clear` — clear upcoming queue without stopping current song (DJ)
- `/skip` — now uses vote skip for non-DJ users

### Web UI
- Edit playlist page with individual track management
- Delete playlist with confirmation dialog
- Create page redesigned with individual track rows instead of textarea

## Tech Stack
- **Bot**: discord.js v14, lavalink-client
- **Audio**: Lavalink
- **Web**: Next.js 15, React 19
- **Data**: JSON file storage
