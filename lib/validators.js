//const valida = require('./');
const validators = module.exports = {};

function isInteger(number) {
  return typeof number === 'number' &&
     isFinite(number) &&
     Math.floor(number) === number;
}

/**
 * Validates that value is not undefined or null.
 *
 * @param {*} value
 * @returns {boolean}
 */
validators.required = (value) => {
  return value !== undefined && value !== null;
};

/**
 * Validates that if the value is defined and not null,
 * it has length greater than 0.
 *
 * @param {*} value
 * @returns {boolean}
 */
validators.notEmpty = (value) => {
  return value === undefined || value === null || value.length > 0;
};

/**
 * Validates that if value is defined and not null, it has length of 0.
 */
validators.empty = (value) => {
  return value === undefined || value === null || value.length === 0;
};


/**
 * @param {*} value
 * @param {object} options
 * @param {RegExp|string} options.pattern
 * @param {string} [options.modifiers]
 * options = { pattern, modified }
 */
validators.regex = (value, options) => {
  if (value === undefined || value === null) {
    return true;
  }

  value = value + '';

  if (Object.prototype.toString.call(options.pattern).slice(8, -1) !== 'RegExp') {
    options.pattern = new RegExp(options.pattern, options.modifiers);
  }

  return options.pattern.test(value);
};

validators.regex.required = ['pattern'];


/**
 * @param {*} value
 * @param {object} options
 * @param {number} [options.min]
 * @param {number} [options.max]
 * @returns {boolean}
 */
validators.len = (value, options) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (!Array.isArray(value)) {
    value = value + '';
  }

  let valid = true;
  if (options.min !== undefined && options.min > value.length) {
    valid = false;
  }
  if (options.max !== undefined && options.max < value.length) {
    valid = false;
  }

  return valid;
};

/**
 * @param {*} array
 * @returns {boolean}
 */
validators.array = (value) => {
  if (value === undefined || value === null) {
    return true;
  }

  return Array.isArray(value);
};

/**
 * Validates that a value is an object, and not
 * scalars or arrays.
 *
 * @param {*} value
 * @returns {boolean}
 */
validators.plainObject = (value) => {
  return (
    (value === undefined || value === null)
    || (typeof value === 'object' && !Array.isArray(value))
  );
};

/**
 * Validates if a value is a date
 *
 * @param {*} value
 * @returns {boolean}
 */
validators.date = (value) => {
  if (value === undefined || value === null) {
    return true;
  }

  const date = Date.parse(value);
  return !isNaN(date);
};

/**
 *
 * @param {*} value
 * @returns {boolean}
 */
validators.integer = (value) => {
  return value === undefined || value === null || isInteger(value);
};

/**
 *
 * @param {*} value
 * @param {object} options
 * @param {array} options.items
 * @returns {boolean}
 */
validators.enum = (value, options) => {
  return value === undefined || value === null || options.items.indexOf(value) !== -1;
};

validators.enum.required = ['items'];

/**
 *
 * @param {*} value
 * @returns {boolean}
 */
validators.bool = (value) => {
  return value === undefined || value === null || typeof value === 'boolean';
};

/**
 * @param {*} value
 * @returns {boolean}
 */
validators.float = (value) => {
  return (
    value === undefined
    || value === null
    || (value === +value && value !== (value|0))
  );
};

/**
 * @param {undefined|null|number} value
 * @param {object} [options={}]
 * @param {number} [options.min]
 * @param {number} [options.max]
 * @returns {object|undefined}
 */
validators.range = (value, options = {}) => {
  if (value === undefined || value === null) {
    return true;
  }

  let valid = true;
  if (options.min !== undefined && options.min > value) {
    valid = false;
  }
  if (options.max !== undefined && options.max < value) {
    valid = false;
  }
  return valid;
};

/*
TODO: figure out schema
validators.schema = (value, options, ctx) => {
  if (value === undefined || value === null) {
    return;
  }

  const innerCtx = valida.process(value, options.schema, ctx.groups);
  if (!innerCtx.isValid) {
    return innerCtx.errors();
  }
};

validators.schema.required = ['schema'];
*/
