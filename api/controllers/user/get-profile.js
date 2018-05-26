module.exports = {


    friendlyName: 'Get profile',
  
  
    description: '',
  
  
    inputs: {
  
    },
  
  
    exits: {
  
    },
  
  
    fn: async function (inputs, exits) {
  
      let user = await User.findOne(this.req.session.userId);
  
      sails.log.debug(`Found a user profile`, user)
      return exits.success(user);

    }  
  };
  