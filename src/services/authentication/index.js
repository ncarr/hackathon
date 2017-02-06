'use strict';

const authentication = require('feathers-authentication');
const MyMLHStrategy = require('passport-oauth2').Strategy;

module.exports = function() {
  const app = this;

  let config = app.get('auth');
  config.oauth2.strategy = MyMLHStrategy;

  app.configure(authentication(config));
};
