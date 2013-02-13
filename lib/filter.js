'use strict';

module.exports = filter;

var arrayFilter = Array.prototype.filter;

/**
 * @param {Array.<object>} links
 * @param {string|object.<string, string>} criteriaOrParamName
 * @param {string} [paramValue]
 * @return {Array.<object>}
 */
function filter(links, criteriaOrParamName, paramValue)
{
  if (typeof criteriaOrParamName === 'function')
  {
    return arrayFilter.call(links, criteriaOrParamName, paramValue);
  }

  var criteria = criteriaOrParamName;

  if (typeof paramValue !== 'undefined')
  {
    criteria = {};
    criteria[criteriaOrParamName] = paramValue;
  }

  return arrayFilter.call(links, createLinkMatcher(criteria));
}

/**
 * @private
 * @param {criteria
 * @returns {Function}
 */
function createLinkMatcher(criteria)
{
  var matchers = [];

  Object.keys(criteria).forEach(function(param)
  {
    var valueMatcher = createValueMatcher(criteria[param]);
    var paramMatcher = createParamMatcher(param, valueMatcher);

    matchers.push(paramMatcher);
  });

  return function linkMatches(link)
  {
    for (var i = 0, l = matchers.length; i < l; ++i)
    {
      if (!matchers[i](link))
      {
        return false;
      }
    }

    return true;
  };
}

/**
 * @private
 * @param {string} paramName
 * @param {function(string): boolean} valueMatcher
 * @returns {function(object): boolean}
 */
function createParamMatcher(paramName, valueMatcher)
{
  return function paramMatches(link)
  {
    if (link === null || typeof link !== 'object')
    {
      return false;
    }

    var paramValue = link[paramName];

    if (typeof paramValue === 'undefined')
    {
      return false;
    }

    if (Array.isArray(paramValue))
    {
      for (var i = 0, l = paramValue.length; i < l; ++i)
      {
        var value = paramValue[i];

        if (valueMatcher(value === null ? '' : value.toString()))
        {
          return true;
        }
      }

      return false;
    }

    return valueMatcher(paramValue === null ? '' : paramValue.toString());
  };
}

/**
 * @private
 * @param {string} value
 * @returns {function(string): boolean}
 */
function createValueMatcher(value)
{
  if (value === '*')
  {
    return function() { return true; };
  }

  var lastIndex = value.length - 1;
  var prefix = value[0] === '*';
  var suffix = value[lastIndex] === '*';

  if (prefix && suffix)
  {
    return createContainsMatcher(value.substring(1, lastIndex));
  }
  else if (suffix)
  {
    return createStartsWithMatcher(value.substring(0, lastIndex));
  }
  else if (prefix)
  {
    return createEndsWithMatcher(value.substr(1));
  }
  else
  {
    return createEqualsMatcher(value);
  }
}

/**
 * @private
 * @param {string} value
 * @returns {function(string): boolean}
 */
function createEqualsMatcher(value)
{
  return function equalsString(actualValue)
  {
    return actualValue === value;
  };
}

/**
 * @private
 * @param {string} value
 * @returns {function(string): boolean}
 */
function createContainsMatcher(value)
{
  return function containsString(actualValue)
  {
    return actualValue.indexOf(value) !== -1;
  };
}

/**
 * @private
 * @param {string} value
 * @returns {function(string): boolean}
 */
function createStartsWithMatcher(value)
{
  return function startsWithString(actualValue)
  {
    return actualValue.substr(0, value.length) === value;
  };
}

/**
 * @private
 * @param {string} value
 * @returns {function(string): boolean}
 */
function createEndsWithMatcher(value)
{
  return function endsWithString(actualValue)
  {
    return actualValue.substr(actualValue.length - value.length) === value;
  };
}
