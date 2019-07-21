module.exports = {


  friendlyName: 'Get tracked accounts count',


  description: 'Gets amount of accounts vac,game,economy banned',


  inputs: {
    userId: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    if (inputs.userId) {
      const userPopulated = await User.findOne(inputs.userId).populate('trackedAccounts');
      const totalTracked = userPopulated.trackedAccounts.length;
      const totalVac = userPopulated.trackedAccounts.filter(account => account.vacBanned).length;
      const totalGameBan = userPopulated.trackedAccounts.filter(account => account.numberOfGameBans > 0).length;
      const totalEconomyBan = userPopulated.trackedAccounts.filter(account => account.economyBan !== 'none').length;
      return exits.success({
        totalTracked,
        totalVac,
        totalGameBan,
        totalEconomyBan
      });
    } else {
      const totalTracked = await TrackedAccount.count();
      const totalVac = await TrackedAccount.count({
        vacBanned: true
      });
      const totalGameBan = await TrackedAccount.count({
        numberOfGameBans: {
          '>': 0
        }
      });
      const totalEconomyBan = await TrackedAccount.count({
        economyBan: {
          '!=': 'none'
        }
      });
      return exits.success({
        totalTracked,
        totalVac,
        totalGameBan,
        totalEconomyBan
      });
    }
  }


};
