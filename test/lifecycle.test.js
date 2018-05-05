var sails = require('sails');

// Before running any tests...
before(function (done) {
    require('dotenv').config();
    // Increase the Mocha timeout so that Sails has enough time to lift
    this.timeout(5000);

    sails.lift({
        log: { level: 'warn' },

    }, async function (err) {
        if (err) { return done(err); }

        // here you can load fixtures, etc.
        // (for example, you might want to create some records in the database)

        // This list has a VAC ban, game ban, no ban and invalid id
        sails.playerList = ["76561198028175941", "76561198342779197", "76561198305371279", "1337"]
        sails.testPlayers = {
            vac: "76561198028175941",
            game: "76561198342779197",
            none: "76561198305371279",
            invalid: "1337"
        }

        return done();
    });
});

// After all tests have finished...
after(function (done) {

    // here you can clear fixtures, etc.
    // (e.g. you might want to destroy the records you created above)

    sails.lower(done);

});