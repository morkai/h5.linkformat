/*jshint maxlen:999,maxstatements:999*/
/*global describe:false,it:false*/

'use strict';

require('should');

var filter = require((process.env.LIB_FOR_TESTS_DIR || '../lib') + '/filter');

describe('filter', function()
{
  var links = [
    {href: '/foo/bar', foo: '1'},
    {href: '/foo', foo: '2'},
    {href: '/bar/foo', foo: '1', bar: '1'},
    {href: '/bar', bar: ['2', '3', '4']},
    {href: '/baz', bar: ['5'], baz: null},
    {href: '/baz/qux', baz: [null, 1, null]}
  ];

  it("should work as a functional alternative to `Array.prototype.filter`", function()
  {
    var filterFunc = function(_, i) { return i % this.n === 0; };
    var filterThis = {n: 2};

    filter(links, filterFunc, filterThis).should.be.eql(
      links.filter(filterFunc, filterThis)
    );
  });

  it("should return links matching the single specified property name and value", function()
  {
    filter(links, 'foo', '1').should.be.eql([links[0], links[2]]);
  });

  it("should return links matching the single criterion specified in the criteria object", function()
  {
    filter(links, {foo: '1'}).should.be.eql([links[0], links[2]]);
  });

  it("should return links matching all the specified criteria", function()
  {
    filter(links, {foo: '1', bar: '1'}).should.be.eql([links[2]]);
  });

  it("should return links with param values matching the specified contains criterion", function()
  {
    filter(links, 'href', '*/foo*').should.be.eql([links[0], links[1], links[2]]);
  });

  it("should return links with param values matching the specified prefix criterion", function()
  {
    filter(links, 'href', '/foo*').should.be.eql([links[0], links[1]]);
  });

  it("should return links with param values matching the specified suffix criterion", function()
  {
    filter(links, 'href', '*/foo').should.be.eql([links[1], links[2]]);
  });

  it("should return links with the specified param name if the criterion is `*`", function()
  {
    filter(links, 'foo', '*').should.be.eql([links[0], links[1], links[2]]);
  });

  it("should return links matching at least one value in the param value array", function()
  {
    filter(links, 'bar', '3').should.be.eql([links[3]]);
  });

  it("should filter out non-objects", function()
  {
    filter([null, undefined, 1, 'non object', links[0]], 'foo', '1').should.be.eql([links[0]]);
  });

  it("should convert values to string for matching", function()
  {
    links.push({href: {toString: function() { return '/foo'; }}});

    filter(links, 'href', '/foo').should.be.eql([links[1], links[links.length - 1]]);

    links.pop();
  });

  it("should convert NULL to an empty string for matching", function()
  {
    filter(links, 'baz', '').should.be.eql([links[4], links[5]]);
  });
});
