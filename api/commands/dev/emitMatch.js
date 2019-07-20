const Commando = require('discord.js-commando');

class EmitMatch extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'emitmatch',
      group: 'dev',
      memberName: 'emitmatch',
      description: 'Fake an ongoing match. This is used for development purposes',
      ownerOnly: true,
    });
  }

  async run(msg, args) {

    const fakeMatchData = require('../../../test/fakeMatchData.json')
    const csgoCli = sails.hooks.steambot.getClient();
    const data = {
      matches: [fakeMatchData]
    }

    csgoCli.emit('matchList', data);
    return;
  }

}


module.exports = EmitMatch;
