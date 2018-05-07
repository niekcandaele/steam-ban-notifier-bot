const Discord = require('discord.js');

module.exports = {


    friendlyName: 'Create profile embed',


    description: 'Creates a profile embed for a player.',


    inputs: {

        steamId: {
            type: 'string'
        },

    },


    exits: {

    },


    fn: async function (inputs, exits) {

        try {

            let profileEmbed = new Discord.RichEmbed();

            let playerProfile = await sails.helpers.getSteamProfile(inputs.steamId);
            let banStatus = await sails.helpers.getBanStatus([inputs.steamId]);
            let playerBanStatus = banStatus.get(inputs.steamId);

            profileEmbed.addField(playerProfile.personaname, inputs.steamId)
                .setThumbnail(playerProfile.avatarfull)
                .addField(`VAC bans: ${playerBanStatus.NumberOfVACBans}`, `Game bans: ${playerBanStatus.NumberOfGameBans}`, true)
                .addField('Economy ban', playerBanStatus.EconomyBan, true)
                .setColor('GREEN')


            if (playerBanStatus.NumberOfVACBans > 0 || playerBanStatus.NumberOfGameBans > 0) {
                profileEmbed.setColor("RED")
                profileEmbed.addField('Days since last ban', playerBanStatus.DaysSinceLastBan)
            }

            return exits.success(profileEmbed);

        } catch (error) {

            return exits.error(error);

        }
    }
};

