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
                    validate: (val, msg, arg) => {
                        let steamId = new SteamID.ID(val);
                        let type = steamId.getType();
                        return type === "INDIVIDUAL"
                    }
                }
            ]
        });
    }

    async run(msg, args) {


        let user = await User.findOrCreate({ discordId: msg.author.id }, { discordId: msg.author.id });
        let createdRecord = await TrackedAccount.findOrCreate({ steamId: args.steamId }, { steamId: args.steamId });
        await User.addToCollection(user.id, 'trackedAccounts', createdRecord.id);

        let banStatus = await sails.helpers.getBannedSteamIds([args.steamId]);

        if (banStatus.length !== 1) {
            return msg.channel.send(`Invalid API response!`)
        }

        let foundPlayer = banStatus[0];
        let embed = new Discord.RichEmbed()
        embed.setTitle(`Tracking account`)
            .addField('👤 Steam ID', args.steamId)
            .addField(
                foundPlayer.VACBanned || foundPlayer.NumberOfGameBans > 0 ? `🚫 BANNED` : "✅ Not banned",
                foundPlayer.VACBanned || foundPlayer.NumberOfGameBans > 0 ? `Days since ban: ${foundPlayer.DaysSinceLastBan}` : "-"
            )
            .addField(`VAC bans: ${foundPlayer.NumberOfVACBans}`, `Game bans: ${foundPlayer.NumberOfGameBans}`)
        await msg.channel.send(embed);

    }

}


module.exports = Add;