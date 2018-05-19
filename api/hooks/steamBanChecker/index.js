const handleNewBan = require('./handleNewBan.js')
/**
 * steamBanChecker hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineSteamBanCheckerHook(sails) {

  // 1800000 Ms = 30 minutes
  let checkingIntervalMs = 5000;

  let checkingInterval; // eslint-disable-line no-unused-vars

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`steamBanChecker`)');

      sails.on('hook:orm:loaded', async () => {
        checkingInterval = setInterval(intervalFunc, sails.config.custom.intervalToSendBanChecksMs);
        return done();
      });
    },

  };

};

async function intervalFunc() {

  try {

    let playersToCheck = await TrackedAccount.find({}).limit(sails.config.custom.maxPlayersToCheckPerInterval).populate('trackedBy').populate('trackedByGuild').sort('lastCheckedAt ASC');

    if (playersToCheck.length === 0) {
      sails.log.warn('No players to check! This is not normal...')
      return
    }

    let banStatusChanges = await sails.helpers.detectBanStatus(playersToCheck.map(player => player.id))

    for (const playerToCheck of playersToCheck) {
      await TrackedAccount.update({ id: playerToCheck.id }, {
        lastCheckedAt: Date.now()
      })

      let newBanStatus = banStatusChanges.get(playerToCheck.id);
      if (!_.isUndefined(newBanStatus)) {
        if (newBanStatus.global) {
          await handleNewBan(playerToCheck, newBanStatus)
        }
      }
    }


    
    sails.log.debug(`Checked ${playersToCheck.length} players for new bans`, playersToCheck.map(player => [player.id, player.steamId]));


  } catch (error) {
    throw error;
  }

}


