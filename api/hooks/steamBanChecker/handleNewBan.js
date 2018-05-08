const Discord = require('discord.js');
const sendDm = require('./send-dm.js');
const sendGuildMessage = require('./send-guild-message');
const sendGlobal = require('./send-global.js');

async function handleNewBan(bannedPlayer, newBanStatus) {
    sails.log.info(`New ban detected!`, bannedPlayer.id);

    let steamProfile = await sails.helpers.getSteamProfile(bannedPlayer.steamId)

    let profileEmbed = await sails.helpers.createProfileEmbed(bannedPlayer.steamId);

    await sendDm(bannedPlayer, profileEmbed);
    await sendGuildMessage(bannedPlayer, profileEmbed);
    await sendGlobal(bannedPlayer, profileEmbed);

    await TrackedAccount.update(bannedPlayer.id, {
        banDetectedAt: Date.now(),
        vacBanned: newBanStatus.apiResponse.VACBanned,
        numberOfVacBans: newBanStatus.apiResponse.NumberOfVACBans,
        numberOfGameBans: newBanStatus.apiResponse.NumberOfGameBans,
        economyBan: newBanStatus.apiResponse.EconomyBan,
        communityBanned: newBanStatus.apiResponse.CommunityBanned

    });

}

module.exports = handleNewBan;