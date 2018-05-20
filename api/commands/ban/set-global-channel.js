const Commando = require('discord.js-commando');

class SetGlobalChannel extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setglobalchannel',
      group: 'ban',
      memberName: 'setglobalchannel',
      ownerOnly: true,
      description: 'Set a discord channel to receive global notifications',
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

    await DiscordGuild.update(discordGuild.id, {globalNotificationChannel: args.channel.id});

    msg.channel.send(`☑️ Set ${args.channel.name} as global notification channel!`);

  }

}


module.exports = SetGlobalChannel;
