module.exports = {


    friendlyName: 'View dashboard',
  
  
    description: '',
  
  
    inputs: {
  
    },
  
  
    exits: {

        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/setup'
          },
  
    },
  
  
    fn: async function (inputs, exits) {
      sails.log.info(`Serving setup view to user ${this.req.session.userId}`)
      return exits.success();
  
    }
  
  
  };
  