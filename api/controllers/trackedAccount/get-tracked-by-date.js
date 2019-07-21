module.exports = {


  friendlyName: 'Get tracked accounts count',


  description: 'Gets amount of accounts vac,game,economy banned',


  inputs: {
    since: {
      type: 'number',
    },
    userId: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const currentDate = new Date();
    const response = {};
    let user;
    if (inputs.userId) {
      user = await User.findOne(inputs.userId).populate('trackedAccounts');

    }
    if (!inputs.since) {
      const tempDate = new Date();
      const defaultSince = tempDate.setMonth(tempDate.getMonth() - 11);
      inputs.since = defaultSince.valueOf();
    }

    const since = new Date(inputs.since);
    let dateIterator = since;
    dateIterator.setDate(0);
    let upperLimit = new Date(dateIterator.valueOf());
    upperLimit.setMonth(upperLimit.getMonth() + 1)

    while (dateIterator.valueOf() < currentDate.valueOf()) {

      const whereObjTotal = {
        createdAt: {
          '>': dateIterator.valueOf(),
          '<': upperLimit.valueOf()
        },
      }

      const whereObjBanned = {
        banDetectedAt: {
          '>': dateIterator.valueOf(),
          '<': upperLimit.valueOf()
        },
      }

      if (inputs.userId) {
        const accountIds = user.trackedAccounts.map(a => a.id)
        whereObjTotal.id = accountIds;
        whereObjBanned.id = accountIds;
      }

      const totalTracked = await TrackedAccount.count(whereObjTotal);

      const totalBanned = await TrackedAccount.count(whereObjBanned);

      response[dateIterator.valueOf()] = {
        totalTracked,
        totalBanned
      }

      dateIterator.setMonth(dateIterator.getMonth() + 1);
      upperLimit.setMonth(upperLimit.getMonth() + 1)
    }
    return exits.success(response);
  }


};
