const Commando = require('discord.js-commando');

class SetBanNotificationChannel extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setbannotificationchannel',
      group: 'ban',
      aliases: ['notificationchannel'],
      memberName: 'setbannotificationchannel',
      description: 'Set a discord channel to receive notifications',
      args: [
        {
          key: 'channel',
          prompt: 'Please specify the channel you want to configure',
          type: 'channel'
        }
      ]
    });
  }

  async run(msg, args) {

    let discordGuild = await DiscordGuild.findOrCreate({ discordId: msg.guild.id }, { discordId: msg.guild.id });

    await DiscordGuild.update(discordGuild.id, {banNotificationChannel: args.channel.id});

    msg.channel.send(`☑️ Set ${args.channel.name} as notification channel!`);

  }

}


module.exports = SetBanNotificationChannel;
