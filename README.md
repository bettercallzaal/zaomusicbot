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
- **Node.js 18+**
- **Java 17+** (for Lavalink — the audio engine)
- A **Discord bot application** with token and client ID

> **Why two things?** The bot has two parts: (1) the Discord bot (Node.js) that handles commands and chat, and (2) Lavalink (Java) that handles all audio streaming. They communicate over a WebSocket on port 2333.

### 1. Create a Discord Bot Application

1. Go to https://discord.com/developers/applications
2. Click **New Application**, give it a name
3. Go to **Bot** tab, click **Reset Token**, copy the token — this is your `DISCORD_TOKEN`
4. Copy the **Application ID** from the General Information tab — this is your `CLIENT_ID`
5. Under **Bot** tab, enable these **Privileged Gateway Intents**:
   - Server Members Intent
   - Message Content Intent
6. Go to **OAuth2 > URL Generator**, select scopes: `bot` + `applications.commands`
7. Select bot permissions: `Connect`, `Speak`, `Send Messages`, `Embed Links`, `Use Slash Commands`
8. Copy the generated URL and open it in your browser to invite the bot to your server
9. (Optional) Copy your server's ID — this is your `GUILD_ID` (right-click server > Copy Server ID, with Developer Mode enabled in Discord settings)
10. (Optional) Create a "DJ" role in your server and copy its ID — this is your `DJ_ROLE_ID`

### 2. Clone and install

```bash
git clone https://github.com/bettercallzaal/zaomusicbot.git
cd ZAOMusicBot
npm install
```

### 3. Download Lavalink

Download Lavalink 4.2.2+ (required for Discord DAVE E2EE support):

```bash
curl -L -o lavalink/Lavalink.jar https://github.com/lavalink-devs/Lavalink/releases/download/4.2.2/Lavalink.jar
```

> **Important:** Lavalink **4.2.0+** is required. Discord enforced DAVE (E2EE voice encryption) on March 2, 2026. Older versions (4.0.x) cannot send audio — the bot will join the voice channel but you will hear nothing.

### 4. Install Java 17+ (if not already installed)

**macOS:**
```bash
brew install openjdk@17
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install openjdk-17-jre-headless
```

**Windows:**
Download from https://adoptium.net/temurin/releases/?version=17

Verify with:
```bash
java -version
# Should show: openjdk version "17.x.x" or higher
```

### 5. Configure environment

```bash
cp .env.example bot/.env
```

Edit `bot/.env` and fill in your values:

```env
# Required
DISCORD_TOKEN=your_bot_token_from_step_1
CLIENT_ID=your_application_id_from_step_1

# Optional
GUILD_ID=your_server_id              # Commands register instantly in this server
DJ_ROLE_ID=your_dj_role_id           # Omit = everyone can use DJ commands

# Lavalink (defaults work for local development)
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=zaomusicbot

# Playlist web UI integration (optional)
PLAYLIST_API_URL=http://localhost:3000
PLAYLIST_API_KEY=
```

### 6. Deploy slash commands to Discord

This registers all `/play`, `/skip`, etc. commands with Discord. Run once, or after adding new commands:

```bash
npm run deploy-commands
```

If you set `GUILD_ID`, commands appear instantly in that server. Without it, commands register globally (takes up to 1 hour).

### 7. Start everything

**Option A: Two terminals (recommended for development)**

```bash
# Terminal 1 — Start Lavalink
npm run lavalink

# Terminal 2 — Start the bot (after Lavalink says "ready to accept connections")
npm run dev:bot
```

**Option B: Single command with launcher**

```bash
npm start
```

This runs `launcher.js` which starts Lavalink, waits for it to be ready, then starts the bot automatically.

**Option C: Start everything including web UI**

```bash
# Terminal 1
npm run lavalink

# Terminal 2
npm run dev:bot

# Terminal 3
npm run dev:web
```

### 8. Test it

1. Join a voice channel in your Discord server
2. Type `/play never gonna give you up`
3. The bot should join your voice channel and play music

If the bot joins but you hear no audio, check:
- Lavalink is running and shows `Lavalink is ready to accept connections`
- Lavalink version is 4.2.0+ (check the banner when it starts)
- The bot logs show `dave-jvm: successfully loaded` (DAVE encryption is working)

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

## Hosting on bot-hosting.net

To host on [bot-hosting.net](https://bot-hosting.net), create **two free servers**:

### Server 1: Lavalink (Java)
1. Go to https://bot-hosting.net/panel/create
2. Select **Java** as the language
3. Upload `lavalink/Lavalink.jar` and `lavalink/application.yml` to the server files
4. Set the startup JAR file to `Lavalink.jar`
5. Start the server and verify Lavalink starts successfully
6. Note the server's **IP/hostname** — you'll need this for the bot's `LAVALINK_HOST`

### Server 2: Discord Bot (Node.js)
1. Create another server, select **Node.js**
2. Upload everything inside the `bot/` folder (including `package.json` — node_modules will be installed automatically)
3. Set startup file to `src/index.js`
4. In the **Startup** tab, set environment variables:
   - `DISCORD_TOKEN` — your bot token
   - `CLIENT_ID` — your bot's client ID
   - `LAVALINK_HOST` — Server 1's hostname/IP from step 6 above
   - `LAVALINK_PORT` — `2333`
   - `LAVALINK_PASSWORD` — `zaomusicbot`
5. Start the server — the bot should connect to Lavalink and log in to Discord

### Alternative: Single Server with Launcher
If you want to run both on one Node.js server:
1. Create a server, select **Node.js**
2. Upload the entire project (bot/ + lavalink/ folders)
3. Set startup file to `src/launcher.js`
4. The launcher auto-downloads a portable Java 17 JRE and starts Lavalink before the bot
5. Requires ~512MB+ RAM
6. Set the same environment variables as Server 2 above, but use `LAVALINK_HOST=localhost`

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Bot joins voice but no audio | Lavalink version too old (pre-4.2.0) | Download Lavalink 4.2.2+ — DAVE E2EE is required since March 2026 |
| Bot joins voice but very quiet | Default volume was 10% | Volume now defaults to 50%, use `/volume` to adjust |
| "No results found" for YouTube | YouTube blocks requests | Restart Lavalink — YouTube plugin rotates clients automatically |
| Audius tracks fail to load | Rate limited or API issue | `app_name` is now included in all requests; retry |
| "Could not play" error | Lavalink not running | Start Lavalink first, then the bot |
| Commands not showing in Discord | Commands not deployed | Run `npm run deploy-commands` |
| Commands show but nothing happens | Bot missing permissions | Re-invite bot with Connect, Speak, Send Messages permissions |
| Lavalink won't start | Wrong Java version | Need Java 17+, check with `java -version` |

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
