# h5.linkformat

[![Build Status](https://travis-ci.org/morkai/h5.linkformat.png?branch=master)](https://travis-ci.org/morkai/h5.linkformat)

Partial implementation of the
[RFC-6690](http://tools.ietf.org/html/rfc6690) *(Constrained RESTful Environments (CoRE) Link Format)*
and [draft-bormann-core-links-json-01](http://tools.ietf.org/html/draft-bormann-core-links-json-01)
*(Representing CoRE Link Collections in JSON)* for node.js and the browser.

Why partial? Because the following features are not supported
(see [Link Format](http://tools.ietf.org/html/rfc6690#section-2) section of the RFC):
  - validation of the parameter values (e.g. `foobar` will be accepted as a value
    for the `sz` parameter).
  - `ext-name-star` in `link-extension` (see [RFC-2231](http://tools.ietf.org/html/rfc2231)).

## Usage

```js
var linkFormat = require('h5.linkformat');

var input = [
  '</sensors>;ct=40;title="Sensor Index",',
  '</sensors/temp>;rt="temperature-c";if="sensor",',
  '</sensors/light>;rt="light-lux";if="sensor",',
  '<http://www.example.com/sensors/t123>'
    + ';anchor="/sensors/temp"'
    + ';rel="describedby",',
  '</t>;anchor="/sensors/temp";rel="alternate"'
].join('');

var expected = [
  '</sensors/temp>;rt="temperature-c",if="sensor"',
  '</sensors/light>;rt="light-lux",if="sensor"'
].join(',');

console.log(linkFormat.parse(input).filter({if: 'sensor'}).toString());
```

See the [example/ directory](example/).

## API

### parse

`Array.<object> parse(string input[, object options])`

Accepts:

  - `input` - a required string in the CoRE Link Format to parse.

  - `options` - an optional options object. Valid options include:

    - `allowMultiple` - whether multiple values for params should be allowed. Defaults to `true`.

    - `coerce` - whether to coerce unquoted param values to JavaScript types. Defaults to `false`.

    - `quotedValueConverter` - a `mixed function(string quotedValue)` used to convert quoted param
      string values to JavaScript types. Defaults to a function that replaces all occurrences
      of `\t` with `\\t`, `\r\n` with ` ` and then parses the resulting value as a JSON string
      (using `JSON.parse()`).

Results in an array of link objects. Each object will at least have a `href` property.

Throws if the specified (or the default) `quotedValueConverter` does.

### filter

`Array.<object> filter(Array.<object> links, string paramName, mixed paramValue)`
`Array.<object> filter(Array.<object> links, object criteria)`

Accepts:

  - `links` - an array of link objects to filter.

  - `paramName` - a param name to match.

  - `paramValue` - a param value to match.

    If the param value is equal to `*`, then any value is accepted (only checks whether
    the specified param exists). Also, a wildcard string matching can be performed by prefixing
    and/or suffixing the param value with `*`.

  - `criteria` - a map of param names to param values to match. Specifying `paramName`
    and `paramValue` is the same as:

    ```js
    var criteria = {};
    criteria[paramName] = paramValue;
    ```

Returns an array of link objects that satisfy the specified criteria.

### toString

`string toString(Array.<object> links)`

Accepts:

  - `links` - an array of link objects to serialize to a string.

Returns a string representation of the specified link objects.

### Method chaining

The `index` module exports a special, wrapped version of the `parse` module.

The `toString()` and `filter()` methods of the returned links array are replaced with the functions
from the `toString` and `filter` modules. Also, the `toString()` method of the filtered links array
is replaced with the function from the `toString` module.

So instead of:
```js
var parse = require('h5.linkformat/lib/parse');
var filter = require('h5.linkformat/lib/filter');
var toString = require('h5.linkformat/lib/toString');

console.log(toString(filter(parse(input), 'if', 'sensor')));
```

one can write it like so:
```js
var linkFormat = require('h5.linkformat');

console.log(linkFormat.parse(input).filter('if', 'sensor').toString());
```

Passing a function to the `filter()` method for more complex filtering still works.

## Browser build (AMD)

To generate an AMD version of the library run the following command:

```
npm run-script amd
```

The result should be available in the `build/lib-amd/` directory.

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
