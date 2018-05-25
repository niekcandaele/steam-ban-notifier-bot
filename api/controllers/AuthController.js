var passport = require('passport');

/**
 * AuthController
 *
 * @description Server-side actions for handling incoming requests regarding authentication.
 * @module AuthController
 */


module.exports = {

    steamLogin: function (req, res, next) {
        passport.authenticate('steam', {
            failureRedirect: `${process.env.HOSTNAME}`,
        })(req, res);
    },



    steamReturn: function (req, res) {
        passport.authenticate('steam', {
            failureRedirect: '/login',
        },
            async function (err, user) {
                if (err) {
                    sails.log.error(`Steam auth error - ${err}`);
                    return res.serverError(err);
                };
                sails.log.info(`User ${user.id} successfully logged in`, user);
                req.session.userId = user.id;
                res.redirect('/dashboard');
            })(req, res);
    },
    discordLogin: function (req, res, next) {
        sails.log.debug(`Logging in a user via discord`);
        passport.authenticate('discord', {
            failureRedirect: `${process.env.HOSTNAME}`
        })(req, res);

    },

    discordReturn: function (req, res) {
        passport.authenticate('discord', {
            failureRedirect: '/'
        },
            async function (err, discordProfile) {
                if (err) {
                    sails.log.error(`Discord auth error - ${err}`);
                    return res.serverError(err);
                };

                try {
                    await User.update({
                        id: req.session.userId
                    }, {
                            discordId: discordProfile.id,
                        });
                    sails.log.debug(`User ${req.session.userId} updated discord info successfully`);
                    res.redirect('/dashboard');
                } catch (error) {
                    sails.log.error(`AuthController:discordReturn - Error updating user profile ${error}`);
                }

            })(req, res);
    },




    logout: function (req, res) {
        delete req.session.userId;
        return res.redirect('/');
    },



};