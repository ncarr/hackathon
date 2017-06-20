const restrictToAuthenticated = require('../auth/restrictToAuthenticated');
const User = require('../models/user');

const express = require('express');
const app = express.Router();

app.get('/me', restrictToAuthenticated, (req, res, next) => {
    User.findOne({ id: req.user.id }).populate('events').exec()
        .then(user => res.send(user))
        .catch(next);
});

module.exports = app;
