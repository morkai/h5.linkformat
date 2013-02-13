/*jshint maxlen:999,maxstatements:999*/
/*global describe:false,it:false*/

'use strict';

require('should');

var toString = require((process.env.LIB_FOR_TESTS_DIR || '../lib') + '/toString');

describe('toString', function()
{
  it("should return an empty string if the specified array is empty", function()
  {
    toString([]).should.be.eql('');
  });

  it("should filter out non-object items", function()
  {
    toString([1, null, '', true]).should.be.eql('');
  });

  it("should filter out object without the `href` property", function()
  {
    toString([{}, {foo: 'bar'}, {baz: 'qux'}]).should.be.eql('');
  });

  it("should work with a single link with only a relative URI as a value of the `href` property", function()
  {
    toString([{href: '/foo'}]).should.be.eql('</foo>');
    toString([{href: '/foo/bar'}]).should.be.eql('</foo/bar>');
    toString([{href: '/path/to?key=value#fragment'}]).should.be.eql('</path/to?key=value#fragment>');
  });

  it("should work with a single link with only an absolute URI as a value of the `href` property", function()
  {
    toString([{href: 'http://example.com/foo'}]).should.be.eql('<http://example.com/foo>');
    toString([{href: 'http://example.com/foo/bar'}]).should.be.eql('<http://example.com/foo/bar>');
    toString([{href: 'scheme:user:pass@example.com/path/to?key=value#fragment'}]).should.be.eql('<scheme:user:pass@example.com/path/to?key=value#fragment>');
  });

  it("should work with a single link with one additional single value param", function()
  {
    toString([{href: '/foo', foo: 'bar'}]).should.be.eql('</foo>;foo="bar"');
  });

  it("should work with an empty string as a param value", function()
  {
    toString([{href: '/foo', foo: ''}]).should.be.eql('</foo>;foo=""');
  });

  it("should not include the param-value part if a value of the param is NULL", function()
  {
    toString([{href: '/t', foo: null}]).should.be.eql('</t>;foo');
  });

  it("should not quote param values of type other than string", function()
  {
    toString([{href: '/t', foo: false}]).should.be.eql('</t>;foo=false');
    toString([{href: '/t', foo: 12}]).should.be.eql('</t>;foo=12');
    toString([{href: '/t', foo: 12.34}]).should.be.eql('</t>;foo=12.34');
  });

  it("should work with special characters in param names", function()
  {
    var expected = '</t>;a0!#$&+-.^_`|~=0=1';

    var actual = toString([
      {href: '/t', 'a0!#$&+-.^_`|~=0': 1}
    ]);

    actual.should.be.eql(expected);
  });

  it("should repeat the param if it has multiple values", function()
  {
    var expected = '</t>;foo=1;foo="bar";foo;foo="baz"';

    var actual = toString([
      {href: '/t', foo: [1, 'bar', null, 'baz']}
    ]);

    actual.should.be.eql(expected);
  });

  it("should work with multiple links without any additional params", function()
  {
    var expected = '</foo>,<http://example.com/bar>,</baz>';

    var actual = toString([
      {href: '/foo'},
      {href: 'http://example.com/bar'},
      {href: '/baz'}
    ]);

    actual.should.be.eql(expected);
  });

  it("should work with multiple links with multiple params", function()
  {
    var expected = '</foo>;foo=1,<http://example.com/bar>;bar=2;ct=40,</baz>;baz="baz";qux';

    var actual = toString([
      {href: '/foo', foo: 1},
      {href: 'http://example.com/bar', bar: 2, ct: 40},
      {href: '/baz', baz: 'baz', qux: null}
    ]);

    actual.should.be.eql(expected);
  });

  it("should escape whitespace characters in string values", function()
  {
    var expected = '</foo>;foo="\\tHello\\r\\nWorld!"';

    var actual = toString([
      {href: '/foo', foo: '\tHello\r\nWorld!'}
    ]);

    actual.should.be.eql(expected);
  });

  it("should escape backslash characters in string values", function()
  {
    var expected = '</foo>;foo="Hello\\\\r\\\\nWorld!"';

    var actual = toString([
      {href: '/foo', foo: 'Hello\\r\\nWorld!'}
    ]);

    actual.should.be.eql(expected);
  });

  it("should escape DQUOTE characters in string values", function()
  {
    var expected = '</foo>;foo="\\"Hello\'World!\\""';

    var actual = toString([
      {href: '/foo', foo: '"Hello\'World!"'}
    ]);

    actual.should.be.eql(expected);
  });
});
