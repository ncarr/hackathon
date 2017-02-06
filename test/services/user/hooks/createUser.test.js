'use strict';

const assert = require('assert');
const createUser = require('../../../../src\services\user\hooks\createUser.js');

describe('user createUser hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    createUser()(mockHook);

    assert.ok(mockHook.createUser);
  });
});
