const validator = module.exports = {};

function addMessage (err, opt) {
  if (opt.msg) {
    err.msg = opt.msg;
  }
}

function isInteger(number) {
  return typeof number === 'number' &&
     isFinite(number) &&
     Math.floor(number) === number;
}

validator.required = function(ctx, options, value) {
  if (typeof value == 'undefined' || value === null) {
    const err = { validator: 'required' };
    addMessage(err, options);

    return err;
  }
};


validator.empty = function(ctx, options, value) {
  if (typeof value !== 'undefined' && value !== null && !value.length) {
    const err = { validator: 'empty' };
    addMessage(err, options);

    return err;
  }
};


/*
 * options = { pattern, modified }
 */
validator.regex = function(ctx, options, value) {
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
    addMessage(err, options);

    return err;
  }
};


/*
 * options = { min, max }
 * value = array and non-array
 */
validator.len = function(ctx, options, value) {
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

  addMessage(err, options);

  if (!valid) {
    return err;
  }
};


validator.array = function(ctx, options, value) {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    const err = { validator: 'array' };
    addMessage(err, options);

    return err;
  }
};


validator.schema = function(ctx, options, value, cb) {
  if (typeof value == 'undefined' || value === null) {
    return cb();
  }
  if (typeof options.schema === 'undefined') {
    return cb(new Error('validator requires schema option'));
  }

  value = Array.isArray(value) ? value : [ value ];

  const errors = {};

  const verify = () => {
    if (Object.keys(errors).length) {
      return cb(null, { validator: 'schema', errors: errors });
    }
    cb();
  };

  const isValid = (i, ctx) => {
    if (ctx.isValid()) {
      return;
    }

    errors[i] = ctx.errors();
  };

  const parallel = value.map((permission, i) => {
    return ctx.valida.process(permission, options.schema)
      .then(isValid.bind(null, i));
  });

  return Promise.all(parallel.map((p) => p.catch((e) => e))).then(verify);
};


validator.plainObject = function(ctx, options, value) {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    const err = { validator: 'plainObject' };
    addMessage(err, options);

    return err;
  }
};


validator.date = function(ctx, options, value) {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  const date = Date.parse(value);
  if (isNaN(date)) {
    const err = {validator: 'date'};
    addMessage(err, options);

    return err;
  }
};

validator.integer = function(ctx, options, value) {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (!isInteger(value)) {
    const err = {validator: 'integer'};
    addMessage(err, options);

    return err;
  }
};

validator.enum = function(ctx, options, value) {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  if (options.items.indexOf(value) == -1) {
    const err = {validator: 'enum'};
    addMessage(err, options);

    return err;
  }
};

validator.bool = function(ctx, options, value) {
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

validator.float = function(ctx, options, value) {
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

validator.range = function(ctx, options, value) {
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

  addMessage(err, options);
  return err;
};

validator.custom = function(ctx, options, value) {
  if (typeof value == 'undefined' || value === null) {
    return;
  }

  const validator = options.key || 'custom';
  const msg = options.msg || 'custom';
  const err = { validator, msg };

  if (!options.validation(value, ctx.obj)) {
    return err;
  }
};
