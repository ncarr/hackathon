const cfg = require('../../config/mymlh');
const EducationError = require('../errors/EducationError');

const path = require('path');
const express = require('express');
const app = express.Router();

const passport = require('passport');
const MyMLHStrategy = require('passport-mymlh').Strategy;
const scopes = ['email', 'demographics', 'education', 'event'];

const User = require('../models/user');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.findOne({ id: id }).exec()
        .then(user => done(null, user))
        .catch(done);
});

passport.use(new MyMLHStrategy(
    {
        clientID: cfg.CLIENT_ID,
        clientSecret: cfg.CLIENT_SECRET,
        callbackURL: 'http://localhost:8000/auth/mymlh/callback',
        scope: scopes
    },
    (accessToken, refreshToken, profile, done) => {
        if (profile.level_of_study != 'High School / Secondary School') {
            return done(new EducationError());
        }
        User.findOne({ id: profile.id }).exec()
            .then(user => {
                if (user) {
                  return done(null, user);
                } else {
                  return User.create({
                      id: profile.id,
                      email: profile.email,
                      name: profile.first_name + ' ' + profile.last_name,
                      shirtSize: profile.shirt_size,
                      dietaryRestrictions: profile.dietary_restrictions,
                      specialNeeds: profile.special_needs,
                      gender: profile.gender,
                      school: profile.school,
                      accessToken: accessToken,
                      roles: ['hacker']
                  })
                    .then(user => done(null, user))
                }
            })
            .catch(done);
    }
));

app.get('/', passport.authenticate('mymlh', { scope: scopes }));
app.get('/callback', passport.authenticate('mymlh', {
    failureRedirect: '/auth/mymlh/failure'
}), (req, res, next) => {
    req.session.save(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/auth/mymlh/success');
        }
    })
});
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/success.html'));
});
app.get('/failure', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/failure.html'));
});

module.exports = app
