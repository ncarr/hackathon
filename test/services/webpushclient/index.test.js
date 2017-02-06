'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('webpushclient service', function() {
  it('registered the webpushclients service', () => {
    assert.ok(app.service('webpushclients'));
  });
});
