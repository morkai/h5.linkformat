'use strict';

var toString = require('../lib/toString');

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

var expected = [
  '</sensors>;ct="40";title="Sensor Index",',
  '</sensors/temp>;rt="temperature-c";if="sensor",',
  '</sensors/light>;rt="light-lux";if="sensor",',
  '<http://www.example.com/sensors/t123>'
    + ';anchor="/sensors/temp"'
    + ';rel="describedby",',
  '</t>;anchor="/sensors/temp";rel="alternate"'
].join('');

var actual = toString(links);

console.log('Links:');
console.log('------');
console.log(links);
console.log();
console.log('Expected:');
console.log('---------');
console.log(expected);
console.log();
console.log('Actual:');
console.log('-------');
console.log(actual);
