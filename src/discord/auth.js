module.exports = bot => {
    const ServerError = require('../errors/ServerError');
    const restrictToAuthenticated = require('../auth/restrictToAuthenticated');

    const path = require('path');
    const cfg = require('../../config/discord');
    const express = require('express');
    const router = express.Router();

    const passport = require('passport');
    const DiscordStrategy = require('passport-discord').Strategy;
    const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

    const User = require('../models/user');
     
    passport.use(new DiscordStrategy(
        {
            clientID: cfg.CLIENT_ID,
            clientSecret: cfg.CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/connect/discord/callback',
            scope: scopes,
            passReqToCallback: true
        },
        (req, accessToken, refreshToken, profile, done) => {
            User.findOne({ id: req.user.id }).exec()
                .then(user => {
                    if (user) {
                      for ([snowflake, guild] of bot.guilds) {
                          if (snowflake == cfg.GUILD) {
                              guild.addMember(profile, { accessToken: accessToken, nick: user.name });
                              user.discord = profile.id;
                              return user.save()
                                .then(user => done(null, profile));
                          }
                      }
                      // If we haven't returned a user yet, the bot is no longer in the event's server
                      return done(new ServerError('Bot is not in the Discord server for the event'));
                    } else {
                      return done(null, false);
                    }
                })
                .catch(done);
        }
    ));
    router.use(restrictToAuthenticated);
    router.get('/', passport.authorize('discord', { 'session': false }));
    router.get('/callback', passport.authorize('discord', {
        session: false,
        failureRedirect: '/connect/discord/failure'
    }), (req, res, next) => res.redirect('/connect/discord/success'));
    router.get('/success', (req, res) => {
        res.sendFile(path.join(__dirname + '/views/success.html'));
    });
    router.get('/failure', (req, res) => {
        res.sendFile(path.join(__dirname + '/views/failure.html'));
    });

    router.bot = bot;

    return router;
}
