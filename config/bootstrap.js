const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const path = require('path');
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {

  const client = new Commando.Client({
    owner: sails.config.custom.discord.owners
  });


  client.on('error', error => {
    sails.log.error(error)
  });

  client.on('commandError', (command, error, message, args, fromPatten) => {
    sails.log.error(error)
  });

  client.on('commandRun', (command, promise, message, args, fromPatten) => {
    sails.log.info(`${command.name} ran by ${message.author.username} on ${message.guild.name}`)
  });


  client.registry
    .registerGroups([
      ['ban', 'Player bans'],
      ['meta', 'Commands about the bot'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, '../api/commands'));

  client.login(process.env.BOT_TOKEN);



  client.on('ready', () => {
    sails.log.info(`Logged in as ${client.user.tag}!`);
    // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
    // (otherwise your server will never lift, since it's waiting on the bootstrap)
    return done();
  });



};
