module.exports = {


    friendlyName: 'View dashboard',
  
  
    description: '',
  
  
    inputs: {
  
    },
  
  
    exits: {

        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/dashboard'
          },
  
    },
  
  
    fn: async function (inputs, exits) {
  
      return exits.success();
  
    }
  
  
  };
  