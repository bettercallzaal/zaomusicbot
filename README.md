# ZAOMusicBot v2.1.0

A feature-rich Discord music bot powered by **Lavalink 4.2.2** and **discord.js v14**, with a **Next.js** playlist management web UI. Supports Discord's DAVE (E2EE voice encryption) protocol enforced since March 2026.

## Supported Platforms

| Platform | How to Use | Status |
|----------|-----------|--------|
| YouTube | `/play <search or URL>` | Ready |
| Spotify | `/play <spotify link>` | Ready |
| SoundCloud | `/play <soundcloud link>` | Ready |
| Audius | `/play audius:<search>` or `/play <audius.co link>` | Ready |
| Bandcamp | `/play <bandcamp link>` | Ready |
| Twitch | `/play <twitch stream link>` | Ready |
| Vimeo | `/play <vimeo link>` | Ready |
| Direct URL | `/play <any .mp3/.wav/audio URL>` | Ready |
| Deezer | `/play <deezer link>` | Needs key (see Setup) |
| Apple Music | `/play <apple music link>` | Needs token (see Setup) |

## Features

### Music Playback
- Multi-platform search and playback via Lavalink
- Queue management with shuffle, loop (track/queue), and autoplay
- Audio filters: Bass Boost, Nightcore, Vaporwave, Karaoke, Tremolo, Vibrato, Rotation, Low Pass
- Now-playing embed with progress bar and active filters display
- Source icons showing where tracks come from
- Default volume starts at 50%

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
| `/skip` | Skip current song | No |
| `/stop` | Stop and clear queue | Yes |
| `/seek <seconds>` | Seek to position | No |
| `/queue [page]` | Show queue | No |
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
- **Row 1:** Pause/Resume | Skip | Stop | Loop | Shuffle
- **Row 2:** `--` Vol -20% | `-` Vol -5% | `+` Vol +5% | `++` Vol +20%

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
│       ├── config.js       # Config loader
│       ├── index.js        # Bot entry point
│       ├── launcher.js     # Combined launcher (Lavalink + bot)
│       └── deploy-commands.js
├── web/                    # Next.js playlist web UI
│   ├── src/app/
│   │   ├── api/playlists/  # REST API routes
│   │   └── playlists/      # UI pages (view, create, edit)
│   └── data/playlists.json
├── lavalink/               # Lavalink server
│   ├── application.yml
│   └── Lavalink.jar        # v4.2.2 (download separately)
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

### 2. Download Lavalink

Download Lavalink 4.2.2+ (required for Discord DAVE E2EE support):

```bash
# From GitHub releases
curl -L -o lavalink/Lavalink.jar https://github.com/lavalink-devs/Lavalink/releases/download/4.2.2/Lavalink.jar
```

> **Important:** Lavalink 4.2.0+ is required. Discord enforced DAVE (E2EE voice encryption) on March 2, 2026. Older versions (4.0.x) cannot send audio.

### 3. Configure environment

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

### 4. Start Lavalink

```bash
npm run lavalink
```

### 5. Deploy slash commands

```bash
npm run deploy-commands
```

### 6. Start the bot

```bash
npm run dev:bot
```

### 7. Start the web UI (optional)

```bash
npm run dev:web
```

## Hosting on bot-hosting.net

To host on [bot-hosting.net](https://bot-hosting.net), create **two free servers**:

### Server 1: Lavalink (Java)
1. Create a new server and select **Java**
2. Upload `lavalink/Lavalink.jar` and `lavalink/application.yml`
3. Set the startup JAR file to `Lavalink.jar`
4. Note the server's IP/hostname for the bot config

### Server 2: Discord Bot (Node.js)
1. Create a new server and select **Node.js**
2. Upload the `bot/` folder contents (including `package.json`)
3. Set startup file to `src/index.js`
4. Set environment variables:
   - `DISCORD_TOKEN` — your bot token
   - `CLIENT_ID` — your bot's client ID
   - `LAVALINK_HOST` — Server 1's hostname/IP
   - `LAVALINK_PORT` — `2333`
   - `LAVALINK_PASSWORD` — `zaomusicbot`

### Alternative: Single Server with Launcher
If you want to run both on one Node.js server, use the launcher:
1. Upload the entire project
2. Set startup file to `src/launcher.js`
3. The launcher auto-downloads Java 17 and starts Lavalink before the bot
4. Requires ~512MB+ RAM

## Roadmap

- [ ] Favorites system — `/fav` to save a song, `/favlist` to view saved favorites
- [ ] Song history — `/history` to see recently played tracks
- [ ] DJ request queue — users submit song requests, DJ approves or denies
- [ ] Auto-lyrics — automatically show lyrics when a song starts
- [ ] Playlist import — paste a Spotify/YouTube playlist URL and save it
- [ ] 24/7 mode — keep the bot in a voice channel playing non-stop
- [ ] Custom playlists per user — personal playlists tied to Discord user IDs
- [ ] Web dashboard auth — Discord OAuth login for the web UI

## Tech Stack
- **Bot**: discord.js v14, lavalink-client v2.9.7
- **Audio**: Lavalink 4.2.2 with DAVE E2EE, YouTube plugin, LavaSrc (Spotify), custom Audius integration
- **Web**: Next.js 15, React 19
- **Data**: JSON file storage
