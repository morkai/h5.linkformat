'use strict';

var parse = require('./parse');
var filter = require('./filter');
var toString = require('./toString');

exports.parse = function wrappedParse(input, options)
{
  var links = parse(input, options);

  Object.defineProperty(links, 'filter', {
    configurable: true,
    enumerable: false,
    value: function(criteriaOrParamName, paramValue)
    {
      var filteredLinks = filter(links, criteriaOrParamName, paramValue);

      defineToStringProperty(filteredLinks);

      return filteredLinks;
    }
  });

  defineToStringProperty(links);

  return links;
};

function defineToStringProperty(links)
{
  Object.defineProperty(links, 'toString', {
    configurable: true,
    enumerable: false,
    value: function()
    {
      return toString(links);
    }
  });
}
