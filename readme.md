# h5.linkformat

[![Build Status](https://travis-ci.org/morkai/h5.linkformat.png?branch=master)](https://travis-ci.org/morkai/h5.linkformat)

Partial implementation of the
[RFC-6690](http://tools.ietf.org/html/rfc6690) *(Constrained RESTful Environments (CoRE) Link Format)*
and [draft-bormann-core-links-json-01](http://tools.ietf.org/html/draft-bormann-core-links-json-01)
*(Representing CoRE Link Collections in JSON)* for node.js and the browser.

The following features are not supported
(see [Link Format](http://tools.ietf.org/html/rfc6690#section-2) section of the RFC):
  - `URI-Reference` validation in `link-value`,
  - `ext-name-star` in `link-extension` (see [RFC-2231](http://tools.ietf.org/html/rfc2231)).

## TODO

  - Validation
  - Serialization to string
  - Documentation
  - npm publish

## Usage

### Parsing

```js
var parse = require('h5.linkformat').parse;

var input = [
  '</sensors>;ct=40;title="Sensor Index",',
  '</sensors/temp>;rt="temperature-c";if="sensor",',
  '</sensors/light>;rt="light-lux";if="sensor",',
  '<http://www.example.com/sensors/t123>;anchor="/sensors/temp";rel="describedby",',
  '</t>;anchor="/sensors/temp";rel="alternate",'
];

var expected = [
  {"href": "/sensors", "ct": "40", "title": "Sensor Index"},
  {"href": "/sensors/temp", "rt":"temperature-c", "if":"sensor"},
  {"href": "/sensors/light", "rt": "light-lux", "if": "sensor"},
  {"href": "http://www.example.com/sensors/t123", "anchor": "/sensors/temp", "rel": "describedby"},
  {"href": "/t", "anchor": "/sensors/temp", "rel":"alternate"}
];

var options = {
  allowMultiple: true,
  coerce: false
};

var actual = parse(input.join(''), options);

require('assert').deepEqual(actual, expected);
```

## API

TODO

## Tests

To run the tests, clone the repository:

```
git clone git://github.com/morkai/h5.linkformat.git
```

Make sure [Grunt](http://gruntjs.com/) is installed globally:
(if not, then check out the Grunt's
[Getting Started guide](https://github.com/gruntjs/grunt/wiki/Getting-started)).

```
grunt -V
```

Install the development dependencies:

```
cd h5.linkformat/
npm install
```

And execute the `grunt test` command.

To generate the code coverage report, execute the `grunt coverage` command.
A detailed code coverage report will be generated in the `build/coverage/`
directory and can be viewed in the browser by opening the
`build/coverage/lcov-report/index.html` file.

## License

This project is released under the
[MIT License](https://raw.github.com/morkai/h5.linkformat/master/license.md).

### Acknowledgements

Regular expressions used in the parser are (with slight modifications) from the
[mkovatsc/Copper](https://github.com/mkovatsc/Copper) project (specifically
[`CopperChrome.parseLinkFormat()`](https://github.com/mkovatsc/Copper/blob/dc77bd2287/chrome/content/Helpers.js#L271))
released under the New BSD License.
