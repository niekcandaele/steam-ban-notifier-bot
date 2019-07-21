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
    sails.log.info(`Serving dashboard view to user ${this.req.session.userId}`)
    return exits.success({
      userId: this.req.session.userId
    });

  }


};
