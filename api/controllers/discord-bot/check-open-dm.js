module.exports = {


  friendlyName: 'Check open dm',


  description: 'Check if the discord bot can open a DM channel with the logged in user',


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
    sails.log.debug(`Checking if we can send DM to discord user ${user.discordId}`)

    try {
      let dmChannel = await discordUser.createDM();

      if (!dmChannel) {
        return exits.success(false);
      } else {
        return exits.success(true)
      }

    } catch (error) {
      sails.log.warn(error);
      return exits.success(false);
    }

  }


};
