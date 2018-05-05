/**
 * steamBanChecker hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineSteamBanCheckerHook(sails) {

  // 1800000 Ms = 30 minutes
  let checkingIntervalMs = 5000

  let checkingInterval;

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`steamBanChecker`)');

      sails.on('hook:orm:loaded', async function () {
        checkingInterval = setInterval(intervalFunc, checkingIntervalMs);
        return done();
      });
    },

  };

};

async function intervalFunc() {

  try {

    let intervalToCheckAccountsMs = 7500
    let dateNow = Date.now();
    let borderDate = dateNow - intervalToCheckAccountsMs;

    let playersToCheck = await TrackedAccount.find({
      lastCheckedAt: {
        '<': borderDate
      }
    })


    sails.log.debug(`Checked ${playersToCheck.length} players for new bans`)


  } catch (error) {
    sails.log.error();
    throw error
  }

}