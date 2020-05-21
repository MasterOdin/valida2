const valida = require('./');

const validator = module.exports = {};

function isInteger(number) {
  return typeof number === 'number' &&
     isFinite(number) &&
     Math.floor(number) === number;
}

validator.required = (value) => {
  if (typeof value == 'undefined' || value === null) {
    return {validator: 'required'};
  }
};


validator.empty = (value) => {
  if (typeof value !== 'undefined' && value !== null && !value.length) {
    return {validator: 'empty'};
  }
};


/*
 * options = { pattern, modified }
 */
validator.regex = (value, options) => {
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
validator.len = (value, options) => {
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


validator.array = (value) => {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    const err = { validator: 'array' };

    return err;
  }
};


validator.schema = (value, options, ctx) => {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  const innerCtx = valida.process(value, options.schema, ctx.groups);
  if (!innerCtx.isValid) {
    return innerCtx.errors();
  }
};

validator.schema.required = ['schema'];


validator.plainObject = (value) => {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    const err = { validator: 'plainObject' };

    return err;
  }
};


validator.date = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  const date = Date.parse(value);
  if (isNaN(date)) {
    const err = {validator: 'date'};

    return err;
  }
};

validator.integer = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (!isInteger(value)) {
    const err = {validator: 'integer'};

    return err;
  }
};

validator.enum = (value, options) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (options.items.indexOf(value) == -1) {
    const err = {validator: 'enum'};

    return err;
  }
};

validator.bool = (value) => {
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

validator.float = (value) => {
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

validator.range = (value, options) => {
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
