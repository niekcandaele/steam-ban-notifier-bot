module.exports = {


  friendlyName: 'Check mutual guild',


  description: 'Check if the logged in user shares a guild with the discord bot.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let user = await User.findOne(this.req.session.userId);
    
    if (_.isUndefined(user)) {
      return exits.error(new Error(`Did not find a valid user.`))
    }
    
    if (!user.discordId) {
      return exits.success(false);
    }
    sails.log.debug(`Checking if sharing a guild with ${user.discordId}`);

    let discordClient = sails.hooks.discordbot.getClient();
    let discordUser = discordClient.users.get(user.discordId);
    
    if (!discordUser) {
      return exits.success(false);
    }



    return exits.success(true);

  }


};
