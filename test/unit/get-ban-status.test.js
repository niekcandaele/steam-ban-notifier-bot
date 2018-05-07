const expect = require('chai').expect;

describe('HELPER - get-ban-status', () => {

  it('Has VAC ban statis', async () => {
    let response = await sails.helpers.getBanStatus(sails.playerList);

    expect(response.get(sails.testPlayers.vac)).to.have.property('VACBanned', true);
    expect(response.get(sails.testPlayers.none)).to.have.property('VACBanned', false);
  });

  it('Has game ban status', async () => {
    let response = await sails.helpers.getBanStatus(sails.playerList);
    expect(response.get(sails.testPlayers.game)).to.have.property('NumberOfGameBans').to.be.at.least(1);
    expect(response.get(sails.testPlayers.none)).to.have.property('NumberOfGameBans').to.be.below(1);
  });
});
