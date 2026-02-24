const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  const commandsDir = __dirname;
  const files = fs.readdirSync(commandsDir).filter(f => f !== 'index.js' && f.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(commandsDir, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }

  console.log(`Loaded ${client.commands.size} commands`);
}

function getCommandsData(client) {
  return Array.from(client.commands.values()).map(c => c.data.toJSON());
}

module.exports = { loadCommands, getCommandsData };
