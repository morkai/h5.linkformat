'use strict';

module.exports = toString;

/**
 * @param {Array.<object>} links
 * @returns {string}
 */
function toString(links)
{
  return links
    .filter(function(link) { return link && link.href; })
    .map(linkToString)
    .join(',');
}

/**
 * @private
 * @param {object} link
 * @returns {string}
 */
function linkToString(link)
{
  var linkStr = [];

  linkStr.push('<', link.href.toString(), '>');

  Object.keys(link).forEach(function(paramName)
  {
    if (paramName === 'href')
    {
      return;
    }

    var paramValues = link[paramName];

    if (!Array.isArray(paramValues))
    {
      paramValues = [paramValues];
    }

    linkParamsToString(linkStr, paramName, paramValues);
  });

  return linkStr.join('');
}

/**
 * @private
 * @param {Array.<string>} linkStr
 * @param {string} paramName
 * @param {Array.<*>} paramValues
 */
function linkParamsToString(linkStr, paramName, paramValues)
{
  paramValues.forEach(function(paramValue)
  {
    linkStr.push(';', paramName);

    if (paramValue === null)
    {
      return;
    }

    linkStr.push('=');

    if (paramValue === '')
    {
      linkStr.push('""');

      return;
    }

    if (typeof paramValue === 'string')
    {
      linkStr.push(JSON.stringify(paramValue));
    }
    else
    {
      linkStr.push(paramValue.toString());
    }
  });
}
