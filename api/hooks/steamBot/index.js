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

        const Steam = require('steam');
        const csgo = require('csgo');
        const bot = new Steam.SteamClient();
        const steamUser = new Steam.SteamUser(bot);
        const steamFriends = new Steam.SteamFriends(bot);
        const steamGC = new Steam.SteamGameCoordinator(bot, 730);
        const CSGOCli = new csgo.CSGOClient(steamUser, steamGC, false);

        bot.connect();

        bot.on('connected', () => {
          sails.log.debug('Connected to steam, trying to log in');
          steamUser.logOn({
            'account_name': process.env.STEAM_USERNAME,
            'password': process.env.STEAM_PW
          });

        });


        bot.on('logOnResponse', (response) => {
          if (response.eresult === Steam.EResult.OK) {
            sails.log.info('Logged in to steam!');
            steamFriends.setPersonaState(Steam.EPersonaState.Online);

            CSGOCli.on('unhandled', (message) => {
              sails.log.warn(`Unhandled CSGO client event`, message);
            });

            CSGOCli.launch();

          }
          else {
            sails.log.error('error, ', response);
            process.exit();
          }
        });


        CSGOCli.on('ready', () => {
          sails.log.info('Launched CSGO');

          setInterval(async () => {
            let steamIdsToCheckForOngoingMatch = loadSteamFriends(steamFriends);

            let startCheck = Date.now();
            sails.log.debug(`Starting check for ongoing matches -  ${steamIdsToCheckForOngoingMatch.length} players to check`);

            for (const steamId of steamIdsToCheckForOngoingMatch) {
              await checkForOngoingMatches(steamId, CSGOCli);
            }

            sails.log.debug(`Finished checking ${steamIdsToCheckForOngoingMatch.length} players for ongoing matches - ${Date.now() - startCheck} ms`);

          }, sails.config.custom.ongoingMatchCheckInterval);

          return done();
        });


        CSGOCli.on('matchList', async (data) => {

          sails.log.debug(`Received a matchList with ${data.matches.length} matches.`);

          if (data.matches[0]) {
            let steamIdsInMatch = new Array();

            for (const accountId of data.matches[0].roundstats_legacy.reservation.account_ids) {
              steamIdsInMatch.push(csgoClient.ToSteamID(accountId));
            }

            let usersInMatch = await User.find({ steamId: steamIdsInMatch });

            sails.log.debug(`Found ${usersInMatch.length} in match.`);

            for (const steamIdToTrack of steamIdsInMatch) {
              let trackedAccount = await TrackedAccount.findOrCreate({ steamId: steamIdToTrack }, { steamId: steamIdToTrack });

              await sails.models.user.addToCollection(usersInMatch.map(user => user.id), 'trackedAccounts', trackedAccount.id);
              sails.log.debug(`Added account ${trackedAccount.id} to ${usersInMatch.length} users' tracking list`, usersInMatch.map(user => user.id));

            }

          }

        });


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
  sails.log.debug(`Checking if ${steamId} is playing a match.`);
  return new Promise(async (resolve) => {
    let accountId = csgoClient.ToAccountID(steamId);
    csgoClient.requestLiveGameForUser(accountId);

    setTimeout(resolve, 1000);

  });
}



