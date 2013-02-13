/*jshint maxlen:999,maxstatements:999*/
/*global describe:false,it:false*/

'use strict';

require('should');

var LIB_DIR = process.env.LIB_FOR_TESTS_DIR || '../lib';
var parse = require(LIB_DIR + '/parse');
var filter = require(LIB_DIR + '/filter');
var linkFormat = require(LIB_DIR);

describe('index', function()
{
  describe("parse", function()
  {
    var input = [
      '</sensors>;ct=40;title="Sensor Index",',
      '</sensors/temp>;rt="temperature-c";if="sensor",',
      '</sensors/light>;rt="light-lux";if="sensor",',
      '<http://www.example.com/sensors/t123>'
        + ';anchor="/sensors/temp"'
        + ';rel="describedby",',
      '</t>;anchor="/sensors/temp";rel="alternate"'
    ].join('');

    it("should delegate to `parse()` from `lib/parse.js`", function()
    {
      linkFormat.parse(input).should.be.eql(parse(input));
    });

    it("should attach a non-enumerable filter property of type function to the parsed link array", function()
    {
      var links = linkFormat.parse(input);

      links.filter.should.be.a('function');
      links.propertyIsEnumerable('filter').should.be.eql(false);
    });

    it("should bind the attached filter to the resulting link array", function()
    {
      var links = linkFormat.parse(input);
      var criteria = {href: '/sensors*', if: 'sensor'};

      links.filter(criteria).should.be.eql(filter(links, criteria));
    });
  });
});
