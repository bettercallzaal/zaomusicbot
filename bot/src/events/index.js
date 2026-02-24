const fs = require('fs');
const path = require('path');

function loadEvents(client) {
  const eventsDir = __dirname;
  const files = fs.readdirSync(eventsDir).filter(f => f !== 'index.js' && f.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(eventsDir, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  console.log(`Loaded ${files.length} events`);
}

module.exports = { loadEvents };
