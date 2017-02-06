'use strict';

const assert = require('assert');
const myMlh = require('../../../../src\services\user\hooks\getUser.js');

describe('user getUser hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    myMlh()(mockHook);

    assert.ok(mockHook.getUser);
  });
});
