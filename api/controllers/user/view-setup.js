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
  
      return exits.success();
  
    }
  
  
  };
  