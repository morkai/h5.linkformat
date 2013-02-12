'use strict';

var parse = require('../lib').parse;

var input = [
  '</sensors>;ct=40;title="Sensor Index",',
  '</sensors/temp>;rt="temperature-c";if="sensor",',
  '</sensors/light>;rt="light-lux";if="sensor",',
  '<http://www.example.com/sensors/t123>'
    + ';anchor="/sensors/temp"'
    + ';rel="describedby",',
  '</t>;anchor="/sensors/temp";rel="alternate",'
];

var expected = [
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

var options = {
  allowMultiple: true,
  coerce: false
};

var actual = parse(input.join(''), options);

require('assert').deepEqual(actual, expected);
