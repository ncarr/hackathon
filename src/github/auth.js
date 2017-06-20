const restrictToAuthenticated = require('../auth/restrictToAuthenticated');

const path = require('path');
const cfg = require('../../config/github');
const express = require('express');
const app = express.Router();

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const scopes = ['repo'];

const User = require('../models/user');
 
passport.use(new GitHubStrategy(
    {
        clientID: cfg.CLIENT_ID,
        clientSecret: cfg.CLIENT_SECRET,
        callbackURL: 'http://localhost:8000/connect/github/callback',
        scope: scopes,
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
        User.findOne({ id: req.user.id }).exec()
            .then(user => {
                if (user) {
                  user.github = profile.id;
                  user.githubToken = accessToken;
                  return user.save()
                    .then(user => done(null, profile));
                } else {
                  return done(null, false);
                }
            })
            .catch(done);
    }
));
app.use(restrictToAuthenticated);
app.get('/', passport.authorize('github', { 'session': false }));
app.get('/callback', passport.authorize('github', {
    session: false,
    failureRedirect: '/connect/github/failure'
}), (req, res, next) => res.redirect('/connect/github/success'));
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/success.html'));
});
app.get('/failure', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/failure.html'));
});

module.exports = app;
