'use strict';

// src\services\user\hooks\createUser.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};
const Client = require('node-rest-client').Client;
const client = new Client();

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    // Promisifying the client.get api
    return new Promise(function (resolve, reject) {
      client.get("https://my.mlh.io/api/v2/user.json?access_token=" + hook.data.oauth2.accessToken, resolve);
    }).then(function (data, response) {
      // Test to see if the user exists, if the promise resolves the user exists and the hook fails silently, if the promise rejects the user will be created with their MLH id
      return hook.app.service('users').get(data.data.id).then(function (result) {
        hook.result = result;
        return hook
      }).catch(function (err) {
        hook.data._id = data.data.id;
        return hook;
      });
    });
  };
};
