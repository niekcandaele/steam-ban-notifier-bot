module.exports = {


  friendlyName: 'Detect ban status',


  description: 'Detects if a players ban status has changed',


  inputs: {

    trackedAccountIds: {
      required: true,
      type: 'ref'
    }

  },


  exits: {

    noAccounts: {

    }

  },


  fn: async function (inputs, exits) {

    try {

      if (!_.isArray(inputs.trackedAccountIds)) {
        inputs.trackedAccountIds = new Array(inputs.trackedAccountIds);
      }

      let arrayOfSteamIds = new Array();
      let accountsToCheck = new Array();
      let objectToSend = new Map();

      for (const idToSearch of inputs.trackedAccountIds) {
        let account = await TrackedAccount.findOne(idToSearch);
        if (!_.isUndefined(account)) {
          arrayOfSteamIds.push(account.steamId);
          accountsToCheck.push(account);
        }
      }

      if (accountsToCheck.length === 0) {
        return exits.noAccounts();
      }

      let apiResponse = await sails.helpers.getBanStatus(arrayOfSteamIds);
      apiResponse = new Map(apiResponse);

      for (const account of accountsToCheck) {
        let playerStats = apiResponse.get(account.steamId);

        if (!_.isUndefined(playerStats)) {
          let vacChanged = (playerStats.VACBanned && !account.vacBanned) || (account.numberOfVacBans < playerStats.NumberOfVACBans);
          let gameChanged = (account.numberOfGameBans < playerStats.NumberOfGameBans);
          let communityChanged = (playerStats.CommunityBanned && !account.communityBanned);
          let economyChanged = (account.economyBan !== playerStats.EconomyBan);
          let globalChange = vacChanged || gameChanged || communityChanged || economyChanged
          objectToSend.set(account.id, {
            global: globalChange,
            VAC: vacChanged,
            game: gameChanged,
            community: communityChanged,
            economy: economyChanged,
            apiResponse: playerStats
          });

        }
      }


      return exits.success(objectToSend);

    } catch (error) {

      if (error.statusCode === 400) {
        return exits.error(new Error(error));
      }

      return exits.error(error);

    }
  }
};

