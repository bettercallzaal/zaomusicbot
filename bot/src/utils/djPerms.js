const config = require('../config');

function isDJ(member) {
  if (!config.djRoleId) return true; // No DJ role configured = everyone is DJ
  if (member.permissions.has('Administrator')) return true;
  return member.roles.cache.has(config.djRoleId);
}

function requireDJ(interaction) {
  if (!isDJ(interaction.member)) {
    interaction.reply({ content: 'You need the DJ role to use this command.', ephemeral: true });
    return false;
  }
  return true;
}

module.exports = { isDJ, requireDJ };
