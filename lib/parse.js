'use strict';

module.exports = parse;

var schemeRegExp = /^([a-zA-Z][a-zA-Z0-9+-.]*):(?:\/\/)?/;

var PARAM_VALUE_RE =
  '(=\\s*([^"\\s;,]+|"([^"\\\\]*(\\\\.[^"\\\\]*)*)")\\s*)?';

var linksRegExp = new RegExp(
  '(<[^>]*>\\s*(;\\s*[^<"\\s;,=]+\\s*' + PARAM_VALUE_RE + ')*)',
  'g'
);

var linkAndParamsRegExp = /^<([^>]*)>\s*(;[\s\S]+)?\s*$/;

var paramsRegExp =
  /(;\s*[^<"\s;,=]+\s*(=\s*([^"\s;,]+|"([^\\"]*(\\.[^"\\]*)*)"))?)/g;

var keyAndValueRegExp =
  /;\s*([^<"\s;,=]+)\s*(?:=\s*(?:([^"\s;,]+)|"([^"\\]*(?:\\.[^"\\]*)*)"))?/;

/**
 * @param {string} input
 * @param {object} [options]
 * @param {boolean} [options.allowMultiple] Whether multiple values for params
 * should be allowed. Defaults to `true`.
 * @param {boolean} [options.coerce] Whether to coerce unquoted param values to
 * JavaScript types. Defaults to `false`.
 * @param {function(string): string} [options.quotedValueConverter]
 * @return {Array.<object>} An array of objects representing the links parsed
 * from the specified input string.
 */
function parse(input, options)
{
  if (!options)
  {
    options = {};
  }

  options.allowMultiple = options.allowMultiple !== false;
  options.coerce = options.coerce === true;

  if (typeof options.quotedValueConverter !== 'function')
  {
    options.quotedValueConverter = convertQuotedValue;
  }

  var linkValueList = [];

  var matchedLinks = input.match(linksRegExp);

  if (matchedLinks)
  {
    for (var i = 0, l = matchedLinks.length; i < l; ++i)
    {
      var link = parseLink(matchedLinks[i], options);

      if (link !== null)
      {
        linkValueList.push(link);
      }
    }
  }

  return linkValueList;
}

/**
 * @private
 * @param {string} input
 * @param {object} options
 * @param {boolean} options.allowMultiple
 * @param {boolean} options.coerce
 */
function parseLink(input, options)
{
  var matchedLinkAndParams = input.match(linkAndParamsRegExp);

  var uri = matchedLinkAndParams[1].trim();

  if (!schemeRegExp.test(uri) && uri[0] !== '/')
  {
    uri = '/' + uri;
  }

  var link = {href: uri};

  if (matchedLinkAndParams[2])
  {
    parseParams(link, matchedLinkAndParams[2], options);
  }

  return link;
}

/**
 * @private
 * @param {object} link
 * @param {string} input
 * @param {object} options
 * @param {boolean} options.allowMultiple
 * @param {boolean} options.coerce
 */
function parseParams(link, input, options)
{
  var matchedParams = input.match(paramsRegExp);

  for (var i = 0, l = matchedParams.length; i < l; ++i)
  {
    var matchedKeyValue = matchedParams[i].match(keyAndValueRegExp);

    var key = matchedKeyValue[1];

    if (key === 'href')
    {
      continue;
    }

    var unquotedValue = matchedKeyValue[2];
    var quotedValue = matchedKeyValue[3];
    var value;

    if (typeof unquotedValue !== 'undefined')
    {
      value = options.coerce ? coerceValue(unquotedValue) : unquotedValue;
    }
    else if (typeof quotedValue !== 'undefined')
    {
      value = options.quotedValueConverter(quotedValue);
    }
    else
    {
      value = null;
    }

    if (!options.allowMultiple || typeof link[key] === 'undefined')
    {
      link[key] = value;
    }
    else if (Array.isArray(link[key]))
    {
      link[key].push(value);
    }
    else
    {
      link[key] = [link[key], value];
    }
  }
}

/**
 * @private
 * @param {string} value
 * @return {*}
 */
function coerceValue(value)
{
  switch (value.toLowerCase())
  {
    case 'null':
      return null;

    case 'true':
      return true;

    case 'false':
      return false;

    default:
      var num = +value;

      return isNaN(num) ? value : num;
  }
}

/**
 * @private
 * @param {string} quotedValue
 * @returns {string}
 * @see http://tools.ietf.org/html/rfc2616#section-2.2
 */
function convertQuotedValue(quotedValue)
{
  quotedValue = quotedValue
    .replace(/\t/g, '\\t')
    .replace(/\r\n/g, ' ');

  return JSON.parse('"' + quotedValue + '"');
}
