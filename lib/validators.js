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
 * @returns {object|undefined}
 */
validators.required = (value) => {
  if (value === undefined || value === null) {
    return {validator: 'required'};
  }
};

/**
 * Validates that if the value is defined and not null,
 * it has length greater than 0.
 *
 * @param {*} value
 */
validators.notEmpty = (value) => {
  if (value !== undefined && value !== null && value.length === 0) {
    return {validator: 'notEmpty'};
  }
};

/**
 * Validates that if value is defined and not null, it has length of 0.
 */
validators.empty = (value) => {
  if (value !== undefined && value !== null && value.length > 0) {
    return {validator: 'empty'};
  }
};


/*
 * options = { pattern, modified }
 */
validators.regex = (value, options) => {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  value = value + '';

  if (Object.prototype.toString.call(options.pattern).slice(8, -1) !== 'RegExp') {
    options.pattern = new RegExp(options.pattern, options.modifiers);
  }

  if (!options.pattern.test(value)) {
    let mod = '';
    if (options.pattern.global) {
      mod += 'g';
    }
    if (options.pattern.ignoreCase) {
      mod += 'i';
    }
    if (options.pattern.multiline) {
      mod += 'm';
    }

    const err = { validator: 'regex', pattern: options.pattern.source, modifiers: mod };

    return err;
  }
};


/*
 * options = { min, max }
 * value = array and non-array
 */
validators.len = (value, options) => {
  if (typeof value == 'undefined' || value === null) {
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
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    const err = { validator: 'array' };

    return err;
  }
};


validators.plainObject = (value) => {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    const err = { validator: 'plainObject' };

    return err;
  }
};


validators.date = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  const date = Date.parse(value);
  if (isNaN(date)) {
    const err = {validator: 'date'};

    return err;
  }
};

validators.integer = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (!isInteger(value)) {
    const err = {validator: 'integer'};

    return err;
  }
};

validators.enum = (value, options) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (options.items.indexOf(value) == -1) {
    const err = {validator: 'enum'};

    return err;
  }
};

validators.bool = (value) => {
  if (typeof value === 'undefined' || value === null) {
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
 * @returns {object|undefined}
 */
validators.float = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (!(value === +value && value !== (value|0))) {
    return {
      validator: 'float',
      msg: 'Invalid float value.',
    };
  }
};

/**
 * @param {undefined|null|number} value
 * @param {object} [options={}]
 * @param {number} [options.min]
 * @param {number} [options.max]
 * @returns {object|undefined}
 */
validators.range = (value, options = {}) => {
  if (typeof value == 'undefined' || value === null) {
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
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  const innerCtx = valida.process(value, options.schema, ctx.groups);
  if (!innerCtx.isValid) {
    return innerCtx.errors();
  }
};

validators.schema.required = ['schema'];
