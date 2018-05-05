var request = require('request-promise-native');

module.exports = {


  friendlyName: 'Get banned steam ids',


  description: 'Checks the current bans of an array of steamIds',


  inputs: {

    steamIds: {
      required: true,
      type: 'ref'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    try {

      if (typeof inputs.steamIds === typeof new Array()) {
        inputs.steamIds = inputs.steamIds.join(',')
      }

      let apiResponse = await request({
        uri: 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/',
        qs: {
          key: sails.config.custom.steamAPIkey,
          steamids: inputs.steamIds
        },
        headers: {
          'User-Agent': 'Request-Promise',
          'Content-Type': 'application/json'
        },
        json: true
      });

      let objectToSend = new Object();
      for (const returnedPlayer of apiResponse.players) {

        objectToSend[returnedPlayer.SteamId] = returnedPlayer
      }
      return exits.success(objectToSend);

    } catch (error) {

      if (error.statusCode === 400) {
        return exits.error(new Error(error))
      }

      return exits.error(error);

    };
  }
};

