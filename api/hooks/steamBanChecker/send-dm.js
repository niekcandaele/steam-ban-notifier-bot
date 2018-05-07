const Discord = require('discord.js');

module.exports = async function (bannedPlayer, profileEmbed) {

    try {

        if (_.isUndefined(bannedPlayer.trackedBy)) {
            return exits.error(new Error('No users to DM. - trakcedBy undefined'))
        }

        if (!_.isArray(bannedPlayer.trackedBy)) {

        }

        for (const user of bannedPlayer.trackedBy) {
            let discordUser = sails.discordClient.users.get(user.discordId);

            if (!_.isUndefined(discordUser)) {
                let dmChannel = await discordUser.createDM();
                if (!_.isUndefined(dmChannel)) {
                    await dmChannel.send(`A player you were tracking has been banned!`);
                    await dmChannel.send(profileEmbed);
                }
            }

        }

        return sails.log.info(`Sent DM for banned player to ${bannedPlayer.trackedBy.length} users`)
    } catch (error) {

        sails.log.error(error);

    }
}



