const Discord = require('discord.js')
const sendDm = require('./send-dm.js');

async function handleNewBan(bannedPlayer, newBanStatus) {
    sails.log.info(`New ban detected!`, bannedPlayer.id);

    let steamProfile = await sails.helpers.getSteamProfile(bannedPlayer.steamId)

    let profileEmbed = new Discord.RichEmbed();

    profileEmbed.setTitle(`New ban detected!`)
        .addField(`${steamProfile.personaname}`, bannedPlayer.steamId)
        .setThumbnail(steamProfile.avatar)

    await sendDm(bannedPlayer, profileEmbed);

    await TrackedAccount.update(bannedPlayer.id, {
        banDetectedAt: Date.now()
    });

}

module.exports = handleNewBan;