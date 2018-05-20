const Discord = require('discord.js');
const Commando = require('discord.js-commando');

class List extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'list',
      group: 'ban',
      memberName: 'list',
      description: 'List tracked accounts. Use in DM to see personal tracked accounts list.',
    });
  }

  async run(msg) {
    let embed = new Discord.RichEmbed();
    let listOfTrackedAccounts = new String();

    // If message is sent in a guild, list accounts the guild is tracking
    if (msg.channel.guild) {
      let discordGuild = await DiscordGuild.findOrCreate({ discordId: msg.guild.id }, { discordId: msg.guild.id });
      discordGuild = await DiscordGuild.findOne(discordGuild.id).populate('trackedAccounts');

      for (const account of discordGuild.trackedAccounts) {
        listOfTrackedAccounts += `${account.steamId}\n`;
      }

      embed.setTitle(`List of accounts tracked by ${msg.guild.name}`)
           .addField('Total', discordGuild.trackedAccounts.length)
            .setDescription(listOfTrackedAccounts);



    }
    // If message is sent in a DM, list accounts the user is tracking
    else {
      let user = await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });
      user = await User.findOne(user.id).populate('trackedAccounts');

      for (const account of user.trackedAccounts) {
        listOfTrackedAccounts += `${account.steamId}\n`;
      }

      embed.setTitle(`List of accounts tracked by ${msg.author.username}`)
            .addField('Total', user.trackedAccounts.length)
            .setDescription(listOfTrackedAccounts);
    }

    msg.channel.send({ embed });

  }

}


module.exports = List;
