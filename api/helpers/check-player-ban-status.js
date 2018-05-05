var request = require('request-promise-native');

module.exports = {


  friendlyName: 'Check player ban status',


  description: 'Checks the current bans of a player',


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
        uri: 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/',
        qs: {
          key: sails.config.custom.steamAPIkey,
          steamids: inputs.steamId
        },
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true 
      });
      return exits.success(apiResponse.players);

    } catch (error) {

      return exits.error(error);

    };
  }
};

