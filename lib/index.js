'use strict';

var parse = require('./parse');
var filter = require('./filter');

exports.parse = function wrappedParse(input, options)
{
  var links = parse(input, options);

  Object.defineProperty(links, 'filter', {
    configurable: true,
    enumerable: false,
    value: function(criteriaOrParamName, paramValue)
    {
      return filter(links, criteriaOrParamName, paramValue);
    }
  });

  return links;
};
