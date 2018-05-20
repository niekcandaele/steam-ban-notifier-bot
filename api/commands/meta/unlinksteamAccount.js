const Commando = require('discord.js-commando');

class UnlinkSteamAccount extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'unlinksteamaccount',
      group: 'ban',
      memberName: 'unlinksteamaccount',
      description: 'Unlink your discord profile from your steam account.',
    });
  }

  async run(msg) {

    // Make sure a user record is created in the database
    await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });
    await User.update({ discordId: msg.author.id }, { steamId: '0' });

    await msg.channel.send(`🆗 You have unlinked your steam id!`);
  }

}


module.exports = UnlinkSteamAccount;

