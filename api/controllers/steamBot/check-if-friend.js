module.exports = {


  friendlyName: 'Check if friend',


  description: '',


  inputs: {

  },


  exits: {
    badRequest: {
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    if (!this.req.session.userId) {
      return exits.badRequest('You must be logged in');
    }

    let user = await User.findOne(this.req.session.userId);

    if (_.isUndefined(user)) {
      return exits.error(new Error(`Did not find a valid user.`))
    }

    let friendStatus = await sails.hooks.steambot.getFriendStatus(user.steamId);

    sails.log.debug(`Checked if steam friends with ${user.steamId} - ${friendStatus}`)
    return exits.success(friendStatus);

  }


};
