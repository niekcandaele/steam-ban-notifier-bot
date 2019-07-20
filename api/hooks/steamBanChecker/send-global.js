module.exports = async function (bannedPlayer, profileEmbed) {

  try {

    let discordGuildsWithGlobalEnabled = await DiscordGuild.find({
      globalNotificationChannel: {
        '!=': [0, '0']
      }
    });

    for (const discordGuild of discordGuildsWithGlobalEnabled) {
      let channelToSendMessage = await sails.discordClient.channels.get(discordGuild.globalNotificationChannel);

      if (!_.isUndefined(channelToSendMessage)) {
        await channelToSendMessage.send(`A players ban status changed`, {
          embed: profileEmbed
        });
      }
    }

    return;
  } catch (error) {

    sails.log.error(error);

  }
};
