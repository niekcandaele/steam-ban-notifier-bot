const Commando = require('discord.js-commando');
const SteamID = require('@node-steam/id');

class Remove extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      group: 'ban',
      memberName: 'remove',
      description: 'Remove a steam ID from the tracking list',
      args: [
        {
          key: 'steamId',
          prompt: 'Please specify the ID of the player you want to stop tracking.',
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

    args.steamId = new SteamID.ID(args.steamId);
    args.steamId = args.steamId.getSteamID64();

    let trackedAccount = await TrackedAccount.findOrCreate({ steamId: args.steamId }, { steamId: args.steamId });

    // If message is sent in a guild, remove from guild tracking
    if (msg.channel.guild) {
      let discordGuild = await DiscordGuild.findOrCreate({ discordId: msg.guild.id }, { discordId: msg.guild.id });
      await DiscordGuild.removeFromCollection(discordGuild.id, 'trackedAccounts').members(trackedAccount.id);

    }
    // If message is sent in a DM, remove from user tracking
    else {
      let user = await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });
      await User.removeFromCollection(user.id, 'trackedAccounts').members(trackedAccount.id);
    }

    let embed = await sails.helpers.createProfileEmbed(args.steamId);

    msg.channel.send(`Successfully removed this account from the tracking list.`, { embed });

  }

}


module.exports = Remove;


function checkSteamId(val) {
  try {
    let steamId = new SteamID.ID(val);
    let type = steamId.getType();
    return type === 'INDIVIDUAL';
  } catch (error) { // eslint-disable-line no-unused-vars
    return false;
  }
}
