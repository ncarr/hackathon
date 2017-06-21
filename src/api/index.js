const users = require('./users');
const graphql = require('./graphql');

const express = require('express');
const app = express.Router();

app.use('/users', users);
app.use('/graphql', graphql);

module.exports = app;
