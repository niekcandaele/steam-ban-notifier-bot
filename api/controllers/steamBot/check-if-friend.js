module.exports = {


    friendlyName: 'Check if friend',
  
  
    description: '',
  
  
    inputs: {
  
    },
  
  
    exits: {
  
    },
  
  
    fn: async function (inputs, exits) {
  
      let user = await User.findOne(this.req.session.userId);
  
      if (_.isUndefined(user)) {
        return exits.error(new Error(`Did not find a valid user.`))
      }

      let friendStatus = await sails.hooks.steamBot.getFriendStatus(user.steamId);
  
      sails.log.debug(`Checked if steam friends with ${user.steamId} - ${friendStatus}`)
      return exits.success(friendStatus);
  
    }
  
  
  };
  