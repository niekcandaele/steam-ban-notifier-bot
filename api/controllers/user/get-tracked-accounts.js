module.exports = {


  friendlyName: 'Get tracked accounts',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let user = await User.findOne(this.req.session.userId).populate('trackedAccounts');

    if (_.isUndefined(user)) {
      return exits.error(new Error(`Did not find a valid user.`))
    }

    sails.log.debug(`GetTrackedAccounts - found ${user.trackedAccounts.length} accounts for user ${this.req.session.userId}`)
    return exits.success(user.trackedAccounts);

  }


};
