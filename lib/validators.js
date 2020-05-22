const valida = require('./');

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
 * @param {string} value
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
  } else {
    options.modifiers = '';
    if (options.pattern.global) {
      options.modifiers += 'g';
    }
    if (options.pattern.ignoreCase) {
      options.modifiers += 'i';
    }
    if (options.pattern.multiline) {
      options.modifiers += 'm';
    }
  }

  return options.pattern.test(value);
};

validators.regex.required = ['pattern'];


/*
 * options = { min, max }
 * value = array and non-array
 */
validators.len = (value, options) => {
  if (value === undefined || value === null) {
    return;
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

  const err = { validator: 'len' };

  if (options.min) {
    err.min = options.min;
  }
  if (options.max) {
    err.max = options.max;
  }

  if (!valid) {
    return err;
  }
};


validators.array = (value) => {
  if (value === undefined || value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    const err = { validator: 'array' };

    return err;
  }
};


validators.plainObject = (value) => {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    const err = { validator: 'plainObject' };

    return err;
  }
};


validators.date = (value) => {
  if (value === undefined || value === null) {
    return;
  }

  const date = Date.parse(value);
  if (isNaN(date)) {
    const err = {validator: 'date'};

    return err;
  }
};

validators.integer = (value) => {
  if (value === undefined || value === null) {
    return;
  }

  if (!isInteger(value)) {
    const err = {validator: 'integer'};

    return err;
  }
};

validators.enum = (value, options) => {
  if (value === undefined || value === null) {
    return;
  }

  if (options.items.indexOf(value) == -1) {
    const err = {validator: 'enum'};

    return err;
  }
};

validators.bool = (value) => {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== 'boolean') {
    return {
      validator: 'bool',
      msg: 'Invalid bool value.',
    };
  }
};

/**
 * @param {undefined|null|number} value
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
    return;
  }

  let valid = true;
  if (options.min !== undefined && options.min > value) {
    valid = false;
  }
  if (options.max !== undefined && options.max < value) {
    valid = false;
  }
  if (valid) {
    return;
  }

  const err = { validator: 'range' };

  if (options.min !== undefined) {
    err.min = options.min;
  }
  if (options.max !== undefined) {
    err.max = options.max;
  }
  return err;
};

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
