/*global describe, it*/
'use strict';

var assert  = require('assert');

describe('poet generator', function () {
    it('can be imported without blowing up', function () {
        var app = require('../app');
        assert(app !== undefined);
    });
});