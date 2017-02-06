'use strict';
const webpushclient = require('./webpushclient');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(webpushclient);
};
