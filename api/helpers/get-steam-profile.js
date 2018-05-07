var request = require('request-promise-native');

module.exports = {


  friendlyName: 'Get steam profile',


  description: 'Gets information about a player',


  inputs: {

    steamId: {
      required: true,
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    try {
      let apiResponse = await request({
        uri: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/',
        qs: {
          key: sails.config.custom.steamAPIkey,
          steamids: inputs.steamId
        },
        headers: {
          'User-Agent': 'Request-Promise',
          'Content-Type': 'application/json'
        },
        json: true
      });


      return exits.success(apiResponse.response.players[0]);

    } catch (error) {

      if (error.statusCode === 400) {
        return exits.error(new Error(error));
      }

      return exits.error(error);

    }
  }
};

