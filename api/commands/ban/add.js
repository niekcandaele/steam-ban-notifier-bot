const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const SteamID = require('@node-steam/id');

class Add extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'add',
      group: 'ban',
      aliases: ['suspect', 'track'],
      memberName: 'add',
      description: 'Add a new ID to the system to track.',
      args: [
        {
          key: 'steamId',
          prompt: 'Please specify the ID of the player you want to track.',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {

    if (!checkSteamId(args.steamId)) {
      msg.channel.send(`You have provided an invalid steam ID! Make sure you're inputting a user id and not a group or other type of ID.
If you are unsure how to find a steam ID, you can use https://steamid.io/lookup or https://steamidfinder.com/lookup/`)
      return
    }

    args.steamId = new SteamID.ID(args.steamId);
    args.steamId = args.steamId.getSteamID64();


    let trackedAccount = await TrackedAccount.findOrCreate({ steamId: args.steamId }, { steamId: args.steamId });

    // If message is sent in a guild, add to guild tracking
    if (msg.channel.guild) {
      let discordGuild = await DiscordGuild.findOrCreate({ discordId: msg.guild.id }, { discordId: msg.guild.id });
      discordGuild = await DiscordGuild.findOne(discordGuild.id).populate('trackedAccounts');

      // Check if the discord guild can track this account
      if (sails.config.custom.maxAccountsTrackedByServer <= discordGuild.trackedAccounts.length) {
        msg.channel.send(`This server cannot track more accounts, consider removing some! This guild is tracking ${discordGuild.trackedAccounts.length} profiles`)
        return
      }

      await DiscordGuild.addToCollection(discordGuild.id, 'trackedAccounts', trackedAccount.id);
    }

    let user = await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });

    user = await User.findOne(user.id).populate('trackedAccounts');
    // Check if the user can track this account
    if (sails.config.custom.maxAccountsTrackedByUser <= user.trackedAccounts.length) {
      msg.channel.send(`You have reached your maximum amount of accounts to track. Consider removing some! You are tracking ${user.trackedAccounts.length} profiles`)
    } else {
      await User.addToCollection(user.id, 'trackedAccounts', trackedAccount.id);
    }



    let embed = await sails.helpers.createProfileEmbed(args.steamId);

    msg.channel.send({ embed });
    return
  }

}


module.exports = Add;


function checkSteamId(val) {
  try {
    let steamId = new SteamID.ID(val);
    let type = steamId.getType();
    return type === "INDIVIDUAL"
  } catch (error) {
    return false
  }
}