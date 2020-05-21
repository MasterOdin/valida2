const {toLaxTitleCase} = require('titlecase');
const upperCaseFirst = require('upper-case-first');

const sanitizers = module.exports = {};


/**
 * Converts input value to integer using optional radix option.
 *
 * @param {string|number} value
 * @param {object} [options={}]
 * @param {number} [options.radix=10]
 * @returns {number}
 */
sanitizers.toInt = (value, options = {}) => {
  options.radix = options.radix || 10;
  return parseInt(value, options.radix);
};


/**
 * Converts input value to float.
 *
 * @param {string|number} value
 * @param {object} [options={}]
 * @param {number} [options.precision]
 * @returns {number}
 */
sanitizers.toFloat = (value, options = {}) => {
  value = parseFloat(value);
  if (options.precision !== undefined) {
    value = value.toFixed(options.precision);
    value = parseFloat(value);
  }
  return value;
};


/**
 * Converts input value to a Date.
 *
 * @param {string|number|Date} value
 * @returns {Date}
 */
sanitizers.toDate = (value) => {
  return new Date(value);
};


/**
 * Given a string, trim the ends of it of specified characters.
 *
 * @param {string} value
 * @param {object} [options={}]
 * @param {string} [options.chars='\r\n\t\s']
 * @returns {string}
 */
sanitizers.trim = (value, options = {}) => {
  value += '';

  options.chars = options.chars || '\\r\\n\\t\\s';

  return value.replace(new RegExp('^[' + options.chars + ']+|[' + options.chars + ']+$', 'g'), '');
};

/**
 * Converts input value to a string.
 *
 * @param {*} value
 * @returns {string}
 */
sanitizers.toString = (value) => {
  return String(value);
};

/**
 * Converts a string to lowercase.
 *
 * @param {string} value
 * @returns {string}
 */
sanitizers.lowerCase = (value) => {
  return value.toLowerCase();
};

/**
 * Converts a string to uppercase.
 *
 * @param {string} value
 * @returns {string}
 */
sanitizers.upperCase = (value) => {
  return value.toUpperCase();
};

/**
 * Converts a string to Title Case.
 *
 * @param {string} value
 * @returns {string}
 */
sanitizers.titleCase = (value) => {
  return toLaxTitleCase(value);
};

/**
 * Upper cases the first letter of the input string.
 *
 * @param {string} value
 * @returns {string}
 */
sanitizers.upperCaseFirst = (value) => {
  return upperCaseFirst(value);
};

/**
 * Converts input value to boolean.
 *
 * @param {*} value
 * @returns {string}
 */
sanitizers.toBool = (value) => {
  const strVal = String(value).toLowerCase();
  return strVal === 'true' || strVal === '1';
};
