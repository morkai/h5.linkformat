'use strict';

var filter = require('../lib/filter');

var links = [
  {"href": "/sensors", "ct": "40", "title": "Sensor Index"},
  {"href": "/sensors/temp", "rt":"temperature-c", "if":"sensor"},
  {"href": "/sensors/light", "rt": "light-lux", "if": "sensor"},
  {
    "href": "http://www.example.com/sensors/t123",
    "anchor": "/sensors/temp",
    "rel": "describedby"
  },
  {"href": "/t", "anchor": "/sensors/temp", "rel":"alternate"}
];

var expected = [links[1], links[2]];

var actual = filter(links, {href: '*/sensors*', if: 'sensor'});

require('assert').deepEqual(actual, expected);
