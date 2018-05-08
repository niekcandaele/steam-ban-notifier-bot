const Discord = require('discord.js');

module.exports = async function (bannedPlayer, profileEmbed) {

    try {

        if (_.isUndefined(bannedPlayer.trackedByGuild) || !_.isArray(bannedPlayer.trackedByGuild)) {
            return exits.error(new Error('No guilds to message. - trackedByGuild undefined'))
        }

        for (const discordGuildRow of bannedPlayer.trackedByGuild) {
            let channelToSendMessage = await sails.discordClient.channels.get(discordGuildRow.banNotificationChannel);

            if (!_.isUndefined(channelToSendMessage)) {
                await channelToSendMessage.send(`A player was banned!`, {embed: profileEmbed} );
                sails.log.debug(`Sent message to ${channelToSendMessage.name} on ${channelToSendMessage.guild.name}`)
            }
        }


        return sails.log.info(`Sent message for banned player to ${bannedPlayer.trackedByGuild.length} guilds`)
    } catch (error) {

        sails.log.error(error);

    }
}



