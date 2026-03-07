const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const LAVALINK_DIR = path.join(__dirname, '..', '..', 'lavalink');
const LAVALINK_JAR = path.join(LAVALINK_DIR, 'Lavalink.jar');
const JAVA_DIR = path.join(LAVALINK_DIR, 'java');
const JAVA_BIN = path.join(JAVA_DIR, 'bin', 'java');

const JRE_URL = 'https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jre/hotspot/normal/eclipse';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = url.startsWith('https') ? https.get : http.get;
    get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Download failed: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

async function ensureJava() {
  // Check if system java 17+ exists
  try {
    const version = execSync('java -version 2>&1').toString();
    const match = version.match(/version "(\d+)/);
    if (match && parseInt(match[1]) >= 17) {
      console.log('[Launcher] Using system Java:', version.split('\n')[0].trim());
      return 'java';
    }
  } catch {}

  // Check if we already downloaded a JRE
  if (fs.existsSync(JAVA_BIN)) {
    console.log('[Launcher] Using downloaded JRE');
    return JAVA_BIN;
  }

  // Download portable JRE
  console.log('[Launcher] No Java 17+ found. Downloading portable JRE...');
  const tarPath = path.join(LAVALINK_DIR, 'jre.tar.gz');
  await download(JRE_URL, tarPath);

  fs.mkdirSync(JAVA_DIR, { recursive: true });
  execSync(`tar -xzf "${tarPath}" --strip-components=1 -C "${JAVA_DIR}"`);
  fs.unlinkSync(tarPath);

  console.log('[Launcher] JRE downloaded and extracted');
  return JAVA_BIN;
}

function waitForLavalink(port = 2333, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (Date.now() - start > timeout) {
        return reject(new Error('Lavalink failed to start within timeout'));
      }
      const req = http.get(`http://localhost:${port}/version`, (res) => {
        if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 403) {
          resolve();
        } else {
          setTimeout(check, 1000);
        }
      });
      req.on('error', () => setTimeout(check, 1000));
      req.setTimeout(2000, () => { req.destroy(); setTimeout(check, 1000); });
    }
    check();
  });
}

async function main() {
  const javaBin = await ensureJava();

  console.log('[Launcher] Starting Lavalink...');
  const lavalink = spawn(javaBin, ['-jar', LAVALINK_JAR], {
    cwd: LAVALINK_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  lavalink.stdout.on('data', (d) => {
    const line = d.toString().trim();
    if (line) console.log('[Lavalink]', line);
  });
  lavalink.stderr.on('data', (d) => {
    const line = d.toString().trim();
    if (line) console.error('[Lavalink]', line);
  });
  lavalink.on('exit', (code) => {
    console.error(`[Launcher] Lavalink exited with code ${code}`);
    process.exit(1);
  });

  try {
    await waitForLavalink();
    console.log('[Launcher] Lavalink is ready. Starting bot...');
  } catch (err) {
    console.error('[Launcher]', err.message);
    lavalink.kill();
    process.exit(1);
  }

  // Start the bot
  require('./index.js');
}

main().catch((err) => {
  console.error('[Launcher] Fatal error:', err);
  process.exit(1);
});
