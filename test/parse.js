/*jshint maxlen:999,maxstatements:999*/
/*global describe:false,it:false*/

'use strict';

require('should');

var parse = require((process.env.LIB_FOR_TESTS_DIR || '../lib') + '/parse');

describe('parse', function()
{
  it("should return an empty array for empty input string", function()
  {
    parse('').should.be.eql([]);
    parse('        ').should.be.eql([]);
    parse('\n \t \n').should.be.eql([]);
  });

  it("should return an empty array if the input string does not contain any valid links", function()
  {
    parse('foo').should.be.eql([]);
    parse('</foo').should.be.eql([]);
    parse('foo;ct=40').should.be.eql([]);
    parse('</foo;ct=40').should.be.eql([]);
    parse('/foo>;').should.be.eql([]);
  });

  it("should parse a relative URI without any params", function()
  {
    parse('</foo>').should.be.eql([{href: '/foo'}]);
    parse('</foo>;').should.be.eql([{href: '/foo'}]);
  });

  it("should parse a link ignoring whitespace", function()
  {
    parse('   <  /foo   >  ').should.be.eql([{href: '/foo'}]);
  });

  it("should accept an URI with query and fragment", function()
  {
    parse('</foo?bar=baz>').should.be.eql([{href: '/foo?bar=baz'}]);
    parse('</foo#foobar>').should.be.eql([{href: '/foo#foobar'}]);
    parse('</foo?bar=baz#foobar>').should.be.eql([{href: '/foo?bar=baz#foobar'}]);
  });

  it("should parse an absolute URI without any params", function()
  {
    parse('<http://example.com/>').should.be.eql([{href: 'http://example.com/'}]);
    parse('<scheme:user:pass@host/path/to/file.html?key=value#fragment>').should.be.eql([
      {href: 'scheme:user:pass@host/path/to/file.html?key=value#fragment'}
    ]);
  });

  it("should prepend `/` to relative URIs without it", function()
  {
    parse('<foo/bar>').should.be.eql([{href: '/foo/bar'}]);
  });

  it("should accept an empty link", function()
  {
    parse('<>').should.be.eql([{href: '/'}]);
  });

  it("should parse a link with a single unquoted param", function()
  {
    parse('</foo>;ct=40').should.be.eql([{href: '/foo', ct: '40'}]);
  });

  it("should parse a link with a single quoted param", function()
  {
    parse('</foo>;rt="temp"').should.be.eql([{href: '/foo', rt: 'temp'}]);
  });

  it("should parse a link with multiple params without any whitespace", function()
  {
    parse('</foo>;ct=40;rt="temp"').should.be.eql([
      {href: '/foo', ct: '40', rt: 'temp'}
    ]);
  });

  it("should parse a link with multiple params ignoring any whitespace", function()
  {
    parse('</foo> ; ct=40\n;\trt="temp"').should.be.eql([
      {href: '/foo', ct: '40', rt: 'temp'}
    ]);
  });

  it("should allow multiple values for params by default", function()
  {
    parse('</foo>;foo=1;foo=2;foo=3;bar=4').should.be.eql([
      {href: '/foo', foo: ['1', '2', '3'], bar: '4'}
    ]);
  });

  it("should use the last value of a repeating param if multiple values are not allowed", function()
  {
    parse('</foo>;foo=1;foo=2;foo=3;bar=4', {allowMultiple: false}).should.be.eql([
      {href: '/foo', foo: '3', bar: '4'}
    ]);
  });

  it("should ignore a param with name `href`", function()
  {
    parse('</foo>;href="/bar"').should.be.eql([{href: '/foo'}]);
  });

  it("should not coerce by default", function()
  {
    parse('</foo>;num=40;null=null;true=true;false=false;str=str').should.be.eql([
      {href: '/foo', num: '40', null: 'null', true: 'true', false: 'false', str: 'str'}
    ]);
  });

  it("should coerce unquoted values if `coerce` option is `true`", function()
  {
    parse('</foo>;num=40;null=null;true=true;false=false;str=str', {coerce: true}).should.be.eql([
      {href: '/foo', num: 40, null: null, true: true, false: false, str: 'str'}
    ]);
  });

  it("should not coerce quoted values even if `coerce` option is `true`", function()
  {
    parse('</foo>;num="40";null="null";true="true";false="false";str="str"', {coerce: true}).should.be.eql([
      {href: '/foo', num: '40', null: 'null', true: 'true', false: 'false', str: 'str'}
    ]);
  });

  it("should parse multiple links separated by a comma without any whitespace", function()
  {
    parse('</foo>,</bar>,</baz>').should.be.eql([
      {href: '/foo'},
      {href: '/bar'},
      {href: '/baz'}
    ]);
  });

  it("should parse multiple links ignoring any whitespace", function()
  {
    parse('   </foo> , </bar   >,\n<\t/baz>\n\n').should.be.eql([
      {href: '/foo'},
      {href: '/bar'},
      {href: '/baz'}
    ]);
  });

  it("should parse multiple links with params", function()
  {
    parse('</foo>;foo=1, </bar>;foo=1;bar=2,</baz> ;baz="qux"').should.be.eql([
      {href: '/foo', foo: '1'},
      {href: '/bar', foo: '1', bar: '2'},
      {href: '/baz', baz: 'qux'}
    ]);
  });

  it("should set params without values to `null`", function()
  {
    parse('</foo>;foo;bar;baz=1;qux').should.be.eql([
      {href: '/foo', foo: null, bar: null, baz: '1', qux: null}
    ]);
  });

  it("should allow special characters in param names", function()
  {
    parse('</foo>;a0!#$&+-.^_`|~=0;bar=1').should.be.eql([
      {href: '/foo', 'a0!#$&+-.^_`|~': '0', bar: '1'}
    ]);
  });

  it("should allow special characters in unquoted param values", function()
  {
    parse('</foo>;foo=!#$%&\'()*+-./0:<=>?@a[]^_`{|}~;bar=1').should.be.eql([
      {href: '/foo', foo: '!#$%&\'()*+-./0:<=>?@a[]^_`{|}~', bar: '1'}
    ]);
  });

  it("should evaluate backslash characters in quoted param values by default", function()
  {
    parse('</foo>;foo="This\\n\\"should\\"\\\\nwork!"').should.be.eql([
      {href: '/foo', foo: 'This\n"should"\\nwork!'}
    ]);
  });

  it("should convert CR LF in quoted param values to a single space by default", function()
  {
    parse('</foo>;foo="Hello\r\nWorld!"').should.be.eql([
      {href: '/foo', foo: "Hello World!"}
    ]);
  });

  it("should throw an Error if not escaped LF character is present in the quoted param value", function()
  {
    parse.bind(null, '</foo>;foo="Hello\nWorld!"').should.throw();
  });

  it("should use the specified quoted value converter", function()
  {
    parse('</foo>;foo="foo"', {quotedValueConverter: function() { return 'bar'; }}).should.be.eql([
      {href: '/foo', foo: 'bar'}
    ]);
  });
});
