module.exports = async function (bannedPlayer, profileEmbed) {

  try {

    if (_.isUndefined(bannedPlayer.trackedBy) || !_.isArray(bannedPlayer.trackedBy)) {
      return exits.error(new Error('No users to DM. - trackedBy undefined'));
    }

    let successfulMessages = 0

    for (const user of bannedPlayer.trackedBy) {
      let discordUser = sails.discordClient.users.get(user.discordId);

      if (!_.isUndefined(discordUser)) {
        let dmChannel = await discordUser.createDM();
        if (!_.isUndefined(dmChannel)) {

          try {
            await dmChannel.send(`Ban status changed`, {
              embed: profileEmbed
            });
            sails.log.debug(`Sent message to ${discordUser.username}`);
            successfulMessages++
          } catch (error) {
            sails.log.warn(error);
          }
        }
      }

    }

    return sails.log.info(`Sent DM for banned player to ${successfulMessages}/${bannedPlayer.trackedBy.length} users`);
  } catch (error) {

    sails.log.error(error);

  }
};
