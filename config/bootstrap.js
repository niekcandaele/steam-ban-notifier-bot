const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
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

  for (const playerToTrack of ['76561198028175941', '76561198342779197', '76561198305371279', '1337']) {
    //await TrackedAccount.findOrCreate({ steamId: playerToTrack }, { steamId: playerToTrack });
  }

  const client = new Commando.Client({
    owners: sails.config.custom.discord.owners,
    commandPrefix: "=",
    unknownCommandResponse: false,
    invite: "https://discordapp.com/invite/kuDJG6e"
  });


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
      dmChannelWithOwner.send(`I was added to ${guild.name}! Please check the website for more info - https://www.ban-notifier.xyz/`)
      return
    } catch (error) {
      sails.log.error(error)
    }
  });

  client.on('commandRun', (command, promise, message) => {
    sails.log.info(`${command.name} ran by ${message.author.username} - ${message.content}`);
  });

  
  client.registry
  .registerGroups([
    ['ban', 'Player bans'],
    ['meta', 'Commands about the bot'],
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, '../api/commands'));
  
  client.login(process.env.BOT_TOKEN);
  
  sails.discordClient = client;
  
  
  client.on('ready', () => {
    sails.log.info(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('https://www.ban-notifier.xyz/', {type: 'WATCHING'})
    // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
    // (otherwise your server will never lift, since it's waiting on the bootstrap)
    return done();
  });



};
