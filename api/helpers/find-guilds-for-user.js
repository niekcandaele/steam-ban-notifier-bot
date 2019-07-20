module.exports = {


  friendlyName: 'Find guilds for user',


  description: 'Finds guilds registered in the system that a user is member of',


  inputs: {

    userId: {
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    // Array to push found results into and return at the end
    const foundGuilds = [];
    const discordClient = sails.hooks.discordbot.getClient();
    const user = await User.findOne(inputs.userId);
    if (_.isEmpty(user)) {
      return exits.error(`Invalid userId supplied`);
    }

    // If user does not have a discord account linked, return fast.
    if (_.isEmpty(user.discordId)) {
      return exits.success([]);
    }

    for (const [guildId, guild] of discordClient.guilds) {
      const member = await guild.fetchMember(user.discordId);
      if (member) {
        foundGuilds.push(guild);
      }

    }

    return exits.success(foundGuilds);

  }
};
