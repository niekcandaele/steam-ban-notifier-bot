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
          type: 'string',
          validate: (val) => {
            try {
              let steamId = new SteamID.ID(val);
              let type = steamId.getType();
              return type === 'INDIVIDUAL';
            } catch (error) {
              return false
            }
          }
        }
      ]
    });
  }

  async run(msg, args) {


    let user = await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });
    let createdRecord = await TrackedAccount.findOrCreate({ steamId: args.steamId }, { steamId: args.steamId });
    await User.addToCollection(user.id, 'trackedAccounts', createdRecord.id);

    let embed = await sails.helpers.createProfileEmbed(args.steamId);

    msg.channel.send({embed});

  }

}


module.exports = Add;
