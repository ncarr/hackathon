'use strict';

// src\services\user\hooks\MyMLH.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};
const Client = require('node-rest-client').Client;
const client = new Client();

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    // Promisifying the client.get api, adding the response's data to the existing database result, then returning the modified hook
    return new Promise(function (resolve, reject) {
      client.get("https://my.mlh.io/api/v2/user.json?access_token=" + hook.result.oauth2.accessToken, resolve);
    }).then(function (data, response) {
      Object.assign(hook.result, data.data || {});
      return hook;
    });
  };
};
