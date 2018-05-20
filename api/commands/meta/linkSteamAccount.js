const Commando = require('discord.js-commando');
const SteamID = require('@node-steam/id');

class LinkSteamAccount extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'linksteamaccount',
      group: 'ban',
      memberName: 'linksteamaccount',
      description: 'Link your discord profile to your steam account.',
      args: [
        {
          key: 'steamId',
          prompt: 'Please specify your steam ID',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {

    if (!checkSteamId(args.steamId)) {
      msg.channel.send(`You have provided an invalid steam ID! Make sure you're inputting a user id and not a group or other type of ID.
If you are unsure how to find a steam ID, you can use https://steamid.io/lookup or https://steamidfinder.com/lookup/`);
      return;
    }

    // Convert any valid steam ID type to SteamID64
    let steamId = new SteamID.ID(args.steamId);
    args.steamId = steamId.getSteamID64();

    let usersWithSameSteamId = await User.find({
      steamId: args.steamId,
      discordId: {'!=': msg.author.id}
    });

    if (usersWithSameSteamId.length > 0) {
      await msg.channel.send(`Someone else has already linked this steam ID. Please contact support if you think this is not right.`);
      return;
    }

    // Make sure a user record is created in the database
    await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });
    await User.update({ discordId: msg.author.id }, { steamId: args.steamId });

    await msg.channel.send(`🆗 You have linked your steam id! Make sure you added the steam bot as friend to enable automatic tracking.`);
  }

}


module.exports = LinkSteamAccount;

function checkSteamId(val) {
  try {
    let steamId = new SteamID.ID(val);
    let type = steamId.getType();
    return type === 'INDIVIDUAL';
  } catch (error) { // eslint-disable-line no-unused-vars
    return false;
  }
}
