/**
 * steamBot hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineSteamBotHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`steamBot`)');

      sails.on('hook:orm:loaded', async () => {

        var Steam = require("steam"),
          util = require("util"),
          fs = require("fs"),
          csgo = require("csgo"),
          bot = new Steam.SteamClient(),
          steamUser = new Steam.SteamUser(bot),
          steamFriends = new Steam.SteamFriends(bot),
          steamGC = new Steam.SteamGameCoordinator(bot, 730),
          CSGOCli = new csgo.CSGOClient(steamUser, steamGC, false)

        bot.connect();

        bot.on('connected', () => {
          sails.log.debug('Connected to steam, trying to log in');
          steamUser.logOn({
            "account_name": process.env.STEAM_USERNAME,
            "password": process.env.STEAM_PW
          })

        })


        bot.on("logOnResponse", (response) => {
          if (response.eresult == Steam.EResult.OK) {
            sails.log.info('Logged in to steam!');
            CSGOCli.launch();

          }
          else {
            sails.log.error('error, ', response);
            process.exit();
          }
        })


        CSGOCli.on('ready', () => {
          sails.log.info('Launched CSGO');

          setInterval(async () => {
            let steamIdsToCheckForOngoingMatch = loadSteamFriends(steamFriends);

            for (const steamId of steamIdsToCheckForOngoingMatch) {
              checkForOngoingMatches(steamId, CSGOCli);
            }

            sails.log.debug(`Checked ${steamIdsToCheckForOngoingMatch.length} players for ongoing matches`)

          }, sails.config.custom.ongoingMatchCheckInterval)

          return done();
        })


      });
    }

  };

};

// Gets a list of steamIds from the bots friend list.
function loadSteamFriends(steamFriends) {
  let steamIds = new Array();
  for (const friendSteamId in steamFriends.friends) {
    if (steamFriends.friends.hasOwnProperty(friendSteamId)) {
      const element = steamFriends.friends[friendSteamId];
      if (element === 3) {
        steamIds.push(friendSteamId);
      }
    }
  }
  return steamIds;
}

// Checks if any of the bots friend are in a match.
// If they are, a list of all connected steamIds is collected and added to the users tracking list.
async function checkForOngoingMatches(steamId, csgoClient) {
  return new Promise( async (resolve, reject) => {
    let user = await sails.models.user.find({steamId: steamId});
    let accountId = csgoClient.ToAccountID(steamId);
    csgoClient.requestLiveGameForUser(accountId);

    csgoClient.once('matchList', async (data) => {

      if (data.matches[0]) {
        let steamIdsInMatch = new Array();

        for (const accountId of data.matches[0].reservation.account_ids) {
          steamIdsInMatch.push(csgoClient.ToSteamID(accountId));
        }

        for (const steamIdToTrack of steamIdsInMatch) {
          let trackedAccount = await TrackedAccount.findOrCreate({ steamId: steamIdToTrack }, { steamId: steamIdToTrack });

        }

      }
      resolve();
    })

  })




}



