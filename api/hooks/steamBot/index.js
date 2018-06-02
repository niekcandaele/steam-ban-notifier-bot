/**
 * steamBot hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

const Steam = require('steam');
const csgo = require('csgo');
const Long = require('long');
const bot = new Steam.SteamClient();
const steamUser = new Steam.SteamUser(bot);
const steamFriends = new Steam.SteamFriends(bot);
const steamGC = new Steam.SteamGameCoordinator(bot, 730);
const CSGOCli = new csgo.CSGOClient(steamUser, steamGC, false);

module.exports = function defineSteamBotHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: (done) => {

      sails.log.info('Initializing custom hook (`steamBot`)');

      sails.on('hook:discordbot:loaded', async () => {

        const FriendHandler = require("./friendHandler.js");
        const friendHandler = new FriendHandler(steamFriends);

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

          // Left in for dev, easy match data :)
          // Gets the 8 matches in the live tab of csgo's main menu
          // CSGOCli.requestCurrentLiveGames()

          let tickerFunction = async (cb) => {
            let steamIdsToCheckForOngoingMatch = loadSteamFriends(steamFriends);

            let startCheck = Date.now();
            sails.log.verbose(`Starting check for ongoing matches -  ${steamIdsToCheckForOngoingMatch.length} players to check`);

            for (const steamId of steamIdsToCheckForOngoingMatch) {
              await checkForOngoingMatches(steamId, CSGOCli);
            }

            sails.log.debug(`Finished checking ${steamIdsToCheckForOngoingMatch.length} players for ongoing matches - ${Date.now() - startCheck} ms`);

            setTimeout(() => {
              return cb(cb);
            }, 500)
          }

          tickerFunction(tickerFunction);

          return done();
        });


        CSGOCli.on('matchList', async (data) => {

          if (data.matches.length) {
            sails.log.debug(`Received a matchList with ${data.matches.length} match(es).`);
          }

          for (const match of data.matches) {
            let matchId = new Long(match.matchid.low, match.matchid.high, match.matchid.unsigned);
            matchId = matchId.toString();

            let matchRecord = await CsgoMatch.findOrCreate({ matchId: matchId }, {
              matchId: matchId,
              map: match.watchablematchinfo.game_map
            });
            matchRecord = await CsgoMatch.findOne(matchRecord.id).populate('players');


            let steamIdsInMatch = new Array();

            for (const accountId of match.roundstats_legacy.reservation.account_ids) {
              steamIdsInMatch.push(CSGOCli.ToSteamID(accountId));
            }

            let usersInMatch = await User.find({ steamId: steamIdsInMatch });

            sails.log.debug(`Found ${usersInMatch.length} in match.`);


            for (const user of usersInMatch) {

              // See if user and match are associated already
              // If not, we make add to the collection
              let userIsInMatch = matchRecord.players.filter(trackedAccountInMatch => {
                return trackedAccountInMatch.steamId === user.steamId
              });

              if (userIsInMatch.length === 0) {
                let trackedAccountCorrespondingToUser = await TrackedAccount.findOne({ steamId: user.steamId });

                if (!_.isUndefined(trackedAccountCorrespondingToUser)) {
                  sails.log.info(`Associated user ${user.id} with csgo match ${matchRecord.id}`);
                  await sails.models.csgomatch.addToCollection(matchRecord.id, 'players', trackedAccountCorrespondingToUser.id);
                }
              }


              for (const steamIdToTrack of steamIdsInMatch) {

                // Make database associations for Users and trackedAccounts if not done already
                let trackedAccount = await TrackedAccount.findOrCreate({ steamId: steamIdToTrack }, { steamId: steamIdToTrack });
                trackedAccount = await TrackedAccount.findOne(trackedAccount.id).populate('trackedBy', {
                  where: {
                    id: usersInMatch.map(user => user.id)
                  }
                })

                for (const user of usersInMatch) {

                  let userIsTrackingAccount = trackedAccount.trackedBy.filter(userToCheck => user.id === userToCheck.id);

                  if (userIsTrackingAccount.length === 0) {
                    sails.log.info(`Associated user ${user.id} with tracked account ${trackedAccount.id}`);
                    await sails.models.user.addToCollection(user.id, 'trackedAccounts', trackedAccount.id);
                  }
                }
              }
            }

            sails.log.debug(`Handled a match!`, { id: matchRecord.id, map: matchRecord.map }, { users: usersInMatch.map(user => user.id) });
          }



        });


      });
    },

    getFriendStatus: async (steamId) => {
      let friendListArray = loadSteamFriends(steamFriends);
      let idx = friendListArray.indexOf(steamId);

      return idx !== -1
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
  sails.log.verbose(`Checking if ${steamId} is playing a match.`);
  return new Promise(async (resolve) => {
    let accountId = csgoClient.ToAccountID(steamId);
    csgoClient.requestLiveGameForUser(accountId);

    setTimeout(resolve, 1000);

  });
}



