const titleCase = require('titlecase');
const upperCaseFirst = require('upper-case-first');

const sanitizer = module.exports = {};


/**
 * @param {string|number} value
 * @param {object} options
 * @param {number} [options.radix=10]
 * options = { radix = 10 }
 */
sanitizer.toInt = (value, options) => {
  options.radix = options.radix || 10;
  return parseInt(value, options.radix);
};


/**
 * @param {string|number} value
 * @param {object} options
 * @param {number} [options.precision]
 */
sanitizer.toFloat = (value, options) => {
  value = parseFloat(value);
  if (options.precision !== undefined) {
    value = value.toFixed(options.precision);
    value = parseFloat(value);
  }
  return value;
};


/**
 * @param {string|number|Date} value
 */
sanitizer.toDate = (value) => {
  return new Date(value);
};


/*
 * options = { chars }
 */
sanitizer.trim = (value, options) => {
  value += '';

  options.chars = options.chars || '\\r\\n\\t\\s';

  return value.replace(new RegExp('^[' + options.chars + ']+|[' + options.chars + ']+$', 'g'), '');
};

sanitizer.string = (value) => {
  if (value === null) {
    return value;
  }

  return String(value);
};

sanitizer.lowerCase = (value) => {
  return String(value).toLowerCase();
};

sanitizer.titleCase = (value) => {
  return titleCase(value);
};

sanitizer.upperCaseFirst = (value) => {
  return upperCaseFirst(value);
};

sanitizer.upperCase = (value) => {
  return String(value).toUpperCase();
};

sanitizer.toBool = (value) => {
  const strVal = String(value).toLowerCase();
  return strVal === 'true';
};
