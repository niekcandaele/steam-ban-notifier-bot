const expect = require('chai').expect;

describe('HELPER - detect-ban-status', () => {

  beforeEach(async () => {

    for (const playerToTrack of sails.playerList) {
      await TrackedAccount.findOrCreate({ steamId: playerToTrack }, { steamId: playerToTrack });
    }
  });

  afterEach(async () => {
    await TrackedAccount.destroy({});
  });

  it('Detects if a player is game banned', async () => {

    let players = await TrackedAccount.find({});
    let filteredPlayers = players.map(player => player.id);

    let response = await sails.helpers.detectBanStatus(filteredPlayers);
    for (const player of players) {

      if (!_.isUndefined(response.get(player.id))) {
        let gameBannedPlayer = await TrackedAccount.findOne({steamId: sails.testPlayers.game});
        expect(response.get(player.id)).to.have.property('game');
        expect(response.get(gameBannedPlayer.id).game).to.equal(true);
      }
    }
  });

  it('Detects if a player is economy banned', async () => {

    let players = await TrackedAccount.find({});
    let filteredPlayers = players.map(player => player.id);

    let response = await sails.helpers.detectBanStatus(filteredPlayers);
    for (const player of players) {

      if (!_.isUndefined(response.get(player.id))) {
        expect(response.get(player.id)).to.have.property('economy');
      }
    }
  });

  it('Detects if a player is vac banned', async () => {

    let players = await TrackedAccount.find({});
    let filteredPlayers = players.map(player => player.id);

    let response = await sails.helpers.detectBanStatus(filteredPlayers);
    for (const player of players) {

      if (!_.isUndefined(response.get(player.id))) {

        let vacBannedPlayer = await TrackedAccount.findOne({steamId: sails.testPlayers.vac});

        expect(response.get(player.id)).to.have.property('VAC');
        expect(response.get(vacBannedPlayer.id).VAC).to.equal(true);
      }
    }
  });

  it('Detects if a player is community banned', async () => {

    let players = await TrackedAccount.find({});
    let filteredPlayers = players.map(player => player.id);

    let response = await sails.helpers.detectBanStatus(filteredPlayers);
    for (const player of players) {

      if (!_.isUndefined(response.get(player.id))) {
        expect(response.get(player.id)).to.have.property('community');
      }
    }
  });
});
