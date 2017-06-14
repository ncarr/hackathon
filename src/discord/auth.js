module.exports = bot => {
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
            scope: scopes
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ email: profile.email }, (err, user) => {
                if (err) {
                    return done(err);
                } else if (user) {
                  for ([snowflake, guild] of bot.guilds) {
                      if (snowflake == cfg.GUILD) {
                          guild.addMember(profile, { accessToken: accessToken, nick: user.name });
                          user.discord = profile.id;
                          user.save((user) => {})
                      }
                  }
                  return done(err, profile);
                } else {
                  return done(err, false);
                }
            });
        }
    ));

    router.use(passport.initialize());
    router.get('/', passport.authenticate('discord', { 'session': false }));
    router.get('/callback', passport.authenticate('discord', {
        session: false,
        successRedirect: '/connect/discord/success',
        failureRedirect: '/connect/discord/failure'
    }));
    router.get('/success', (req, res) => {
        res.sendFile(path.join(__dirname + '/views/success.html'));
    });
    router.get('/failure', (req, res) => {
        res.sendFile(path.join(__dirname + '/views/failure.html'));
    });

    router.bot = bot;

    return router;
}
