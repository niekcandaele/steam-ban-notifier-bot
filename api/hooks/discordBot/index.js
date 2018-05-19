const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const Commando = require('discord.js-commando');
const path = require('path');

const client = new Commando.Client({
    owner: sails.config.custom.discord.owners,
    commandPrefix: "=",
    unknownCommandResponse: false,
    invite: "https://discordapp.com/invite/kuDJG6e"
});
/**
 * DiscordBot hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineDiscordBotHook(sails) {


    return {

        /**
         * Runs when a Sails app loads/lifts.
         *
         * @param {Function} done
         */
        initialize: function (done) {

            sails.log.info('Initializing custom hook (`DiscordBot`)');

            sails.on('hook:orm:loaded', async () => {
                client.registry
                    .registerGroups([
                        ['ban', 'Player bans'],
                        ['meta', 'Commands about the bot'],
                    ])
                    .registerDefaults()
                    .registerCommandsIn(path.join(__dirname, '../../commands'));

                client.login(process.env.BOT_TOKEN);

                client.on('ready', () => {
                    sails.log.info(`Logged in as ${client.user.tag}!`);
                    client.user.setActivity('https://ban-notifier.xyz/', { type: 'PLAYING' })
                    // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
                    // (otherwise your server will never lift, since it's waiting on the bootstrap)
                    return done();
                });
            });
        },

    };

};




client.on('error', error => {
    sails.log.error(error);
});

client.on('commandError', (command, error) => {
    sails.log.error(error);
});

client.on('guildDelete', (guild) => {
    sails.log.info(`Left guild - ${guild.name}`)
});

client.on('guildCreate', async (guild) => {
    sails.log.info(`New guild! ${guild.name}`)
    try {
        let dmChannelWithOwner = await guild.owner.createDM();
        dmChannelWithOwner.send(`I was added to ${guild.name}! Please check the website for more info on how to get started - https://www.ban-notifier.xyz/`)
        return
    } catch (error) {
        sails.log.error(error)
    }
});

client.on('commandRun', (command, promise, message) => {
    sails.log.info(`${command.name} ran by ${message.author.username} - ${message.content}`);
});