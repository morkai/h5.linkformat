'use strict';

var linkFormat = require('../lib');

var input = [
  '</sensors>;ct=40;title="Sensor Index",',
  '</sensors/temp>;rt="temperature-c";if="sensor",',
  '</sensors/light>;rt="light-lux";if="sensor",',
  '<http://www.example.com/sensors/t123>'
    + ';anchor="/sensors/temp"'
    + ';rel="describedby",',
  '</t>;anchor="/sensors/temp";rel="alternate",'
].join('');

var expected = [
  {"href": "/sensors/temp", "rt":"temperature-c", "if":"sensor"},
  {"href": "/sensors/light", "rt": "light-lux", "if": "sensor"}
];

var actual = linkFormat.parse(input).filter({if: 'sensor'});

require('assert').deepEqual(actual, expected);
