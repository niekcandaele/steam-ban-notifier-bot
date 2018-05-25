/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {

  if (process.env.NODE_ENV !== 'production') {
    let madeAcc = await TrackedAccount.findOrCreate({steamId: "76561198028175941"}, {steamId: "76561198028175941"});
    let cataUser = await User.findOrCreate({steamId: "76561198028175941"}, {steamId: "76561198028175941"});
    await User.addToCollection(cataUser.id, 'trackedAccounts', madeAcc.id)
  }

  return done();
};
