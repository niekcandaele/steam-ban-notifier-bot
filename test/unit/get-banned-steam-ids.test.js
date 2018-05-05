const expect = require('chai').expect

describe('HELPER - get-banned-steam-ids', function () {

    it('Detects if a player is vac banned', async function() {
        let response = await sails.helpers.getBannedSteamIds(sails.playerList);

        expect(response[sails.testPlayers.vac]).to.have.property('VACBanned', true)
        expect(response[sails.testPlayers.none]).to.have.property('VACBanned', false)
    });

    it('Detects if a player is game banned', async function() {
        let response = await sails.helpers.getBannedSteamIds(sails.playerList);

        expect(response[sails.testPlayers.game]).to.have.property('NumberOfGameBans').to.be.at.least(1)
        expect(response[sails.testPlayers.none]).to.have.property('NumberOfGameBans').to.be.below(1)
    });


});