const Steam = require('steam');

class FriendHandler {
  constructor(steamFriends) {
    this.steamFriends = steamFriends;
    this.initialize();
  }


  async initialize() {
    sails.log.debug(`Initializing a new friend handler`);

    // Respond to chat messages
    this.steamFriends.on('message', (steamId, message, chatEntryType) => {
      if (Steam.EChatEntryType.ChatMsg === chatEntryType) {
        sails.log.info(`${steamId} sent a chat message to the steam bot. - ${message}`)
        this.steamFriends.sendMessage(steamId, `Hello! I am a bot BEEP BOOP. I'm not a very smart bot, you should check the website for usage instructions BEEP BOOP.`);
      }
    })

    // Handle friend events
    this.steamFriends.on('friend', (steamId, EFriendRelationship) => {

      if (EFriendRelationship === 0) {
        return sails.log.info(`${steamId} removed the bot from friends list`)
      }

      if (EFriendRelationship === 2) {
        sails.log.info(`New friend request from ${steamId}`);
        handleFriendRequest(this.steamFriends, steamId);
        return
      }
    })
  }
}


async function handleFriendRequest(steamFriends, steamId) {
  steamFriends.addFriend(steamId);

  // Wait some time to make sure the friend request processes...
  setTimeout(() => {
    steamFriends.sendMessage(steamId, `Hello! I will now watch when you are playing CS:GO and start tracking who you play with. Make sure you have logged on to the website and configured your settings. 
To disable automatic tracking, remove me from your friends list. :)
GLHF!`);
  }, 10000)


  return
}

module.exports = FriendHandler
