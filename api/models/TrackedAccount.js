/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

        steamId: {
            type: 'string',
            required: true,
            unique: true
        },

        vacBanned: {
            type: "boolean",
            defaultsTo: false
        },

        numberOfVacBans: {
            type: 'number',
            defaultsTo: 0
        },

        daysSinceLastBan: {
            type: 'number'
        },

        economyBan: {
            type: 'string',
            defaultsTo: 'none'
        },

        communityBanned: {
            type: 'boolean',
            defaultsTo: false
        },

        banDetectedAt: {
            type: 'number',
        },
        
        lastCheckedAt: {
            type: 'number',
            defaultsTo: 0
        },


        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        trackedBy: {
            collection: 'user',
            via: 'trackedAccounts'
        }

    },

};

