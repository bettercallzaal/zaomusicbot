# ZAOMusicBot v2.0.0

A feature-rich Discord music bot powered by **Lavalink** and **discord.js v14**, with a **Next.js** playlist management web UI.

## Supported Platforms

| Platform | How to Use | Icon | Status |
|----------|-----------|------|--------|
| YouTube | `/play <search or URL>` | ▶️ | Ready |
| Spotify | `/play <spotify link>` | 🟢 | Ready |
| SoundCloud | `/play <soundcloud link>` | 🟠 | Ready |
| Audius | `/play audius:<search>` or `/play <audius.co link>` | 🎧 | Ready |
| Bandcamp | `/play <bandcamp link>` | 🎵 | Ready |
| Twitch | `/play <twitch stream link>` | 🎵 | Ready |
| Vimeo | `/play <vimeo link>` | 🎵 | Ready |
| Direct URL | `/play <any .mp3/.wav/audio URL>` | 🎵 | Ready |
| Deezer | `/play <deezer link>` | 🟣 | Needs key (see Setup) |
| Apple Music | `/play <apple music link>` | 🍎 | Needs token (see Setup) |

## Features

### Music Playback
- Multi-platform search and playback via Lavalink
- Queue management with shuffle, loop (track/queue), and autoplay
- Audio filters: Bass Boost, Nightcore, Vaporwave, Karaoke, Tremolo, Vibrato, Rotation, Low Pass
- Now-playing embed with progress bar and active filters display
- Source icons showing where tracks come from
- Default volume starts at 10%

### Volume Controls
- `/volume <1-100>` — set exact volume
- `/volumeup` / `/volumedown` — small adjustments (+/- 5%)
- `/volumebigup` / `/volumebigdown` — big jumps (+/- 20%)
- Player buttons: `--` `-` `+` `++` on every now-playing embed

### Commands

| Command | Description | DJ Only |
|---------|-------------|---------|
| `/play <query>` | Play a song, URL, or `audius:<search>` | No |
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
| `/volume <1-100>` | Set exact volume | Yes |
| `/volumeup` | Volume +5% | Yes |
| `/volumedown` | Volume -5% | Yes |
| `/volumebigup` | Volume +20% | Yes |
| `/volumebigdown` | Volume -20% | Yes |
| `/filter <name>` | Toggle audio filter | Yes |
| `/playlist list` | List all website playlists | No |
| `/playlist load <name>` | Load a playlist into queue | No |
| `/save <name>` | Save current queue as a website playlist | No |
| `/lyrics [query]` | Show lyrics for current or given song | No |
| `/help` | Show all commands | No |

### Player Buttons
Every now-playing embed has two rows of buttons:
- **Row 1:** ⏸️ Pause/Resume | ⏭️ Skip | ⏹️ Stop | 🔁 Loop | 🔀 Shuffle
- **Row 2:** `--` Vol -20% | `-` Vol -5% | `+` Vol +5% | `++` Vol +20%

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
│       ├── services/       # External API integrations (Audius)
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

### Optional: Enable Deezer & Apple Music

In `lavalink/application.yml`, set the source to `true` and add credentials:

**Deezer** — requires a master decryption key:
```yaml
deezer:
  masterDecryptionKey: "your_deezer_master_key"
```

**Apple Music** — requires an Apple Media API token:
```yaml
applemusic:
  mediaAPIToken: "your_apple_media_token"
  countryCode: "US"
```

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

## Roadmap

These are ideas for future development:

- [ ] **Favorites system** — `/fav` to save a song, `/favlist` to view your saved favorites
- [ ] **Song history** — `/history` to see recently played tracks in the server
- [ ] **DJ request queue** — users submit song requests, DJ approves or denies them
- [ ] **Auto-lyrics** — automatically show lyrics when a song starts playing
- [ ] **Playlist import** — paste a Spotify/YouTube playlist URL and save it to the web dashboard
- [ ] **24/7 mode** — keep the bot in a voice channel playing music non-stop
- [ ] **Custom playlists per user** — personal playlists tied to Discord user IDs
- [ ] **Web dashboard auth** — Discord OAuth login for the web UI
- [ ] **Music quiz game** — `/quiz` to start a "guess the song" game in voice chat

## Tech Stack
- **Bot**: discord.js v14, lavalink-client
- **Audio**: Lavalink with YouTube, LavaSrc (Spotify + optional Deezer/Apple Music), and custom Audius integration
- **Web**: Next.js 15, React 19
- **Data**: JSON file storage
