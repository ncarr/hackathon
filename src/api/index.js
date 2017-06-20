const users = require('./users');

const express = require('express');
const app = express.Router();

app.use('/users', users);

module.exports = app;
