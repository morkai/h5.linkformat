'use strict';

var parse = require('./parse');
var filter = require('./filter');
var toString = require('./toString');

/**
 * @param {string} input
 * @param {object} [options]
 * @param {boolean} [options.allowMultiple]
 * @param {boolean} [options.coerce]
 * @param {function(string): string} [options.quotedValueConverter]
 * @returns {Array.<object>}
 * @throws {Error}
 */
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

/**
 * @private
 * @param {Array.<object>} links
 */
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
