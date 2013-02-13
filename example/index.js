'use strict';

var linkFormat = require('../lib');

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

var actual = linkFormat.parse(input).filter({if: 'sensor'}).toString();

console.log('Input:');
console.log('------');
console.log(input);
console.log();
console.log('Expected:');
console.log('---------');
console.log(expected);
console.log();
console.log('Actual:');
console.log('-------');
console.log(actual);
