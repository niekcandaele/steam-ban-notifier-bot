module.exports = {


  friendlyName: 'Test dm',


  description: 'Send a test DM to a logged in user',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {


    let user = await User.findOne(this.req.session.userId);

    if (_.isUndefined(user)) {
      return exits.error(new Error(`Not a valid user logged in`))
    }

    if (!user.discordId) {
      return exits.success(false);
    }

    let discordClient = sails.hooks.discordbot.getClient();
    let discordUser = discordClient.users.get(user.discordId);
    
    if (!discordUser) {
      return exits.success(false);
    }

    try {
      let dmChannel = await discordUser.createDM();
      await dmChannel.send(`This is a test message! If you received this, means everything is working as it should!`)
      return exits.success(true);
    } catch (error) {
      sails.log.warn(error);
      return exits.success(false);
    }

  }
};
