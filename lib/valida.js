const Context = require('./context');
const { schema } = require('./validators');

module.exports = class Valida {
  constructor() {
    this.validators = {};
    this.sanitizers = {};
  }

  /**
   * @param {string} key
   * @param {function} fn = (ctx, options, value, [cb])
   */
  setValidator (key, fn) {
    this.validators[key] = fn;
  }

  setValidators(set) {
    for (const key in set) {
      this.setValidator(key, set[key]);
    }
  }

  /**
   * Note: undefined values are skipped
   *
   * @param {string} key
   * @param {function} fn = (ctx, options, value, [cb])
   */
  setSanitizer(key, fn) {
    this.sanitizers[key] = fn;
  }

  setSanitizers(set) {
    for (const key in set) {
      this.setSanitizer(key, set[key]);
    }
  }

  validateRules(rules) {
    // perform transformations and basic validation of passed schema
    for (const key in rules) {
      for (const rule of rules[key]) {
        if (rule.sanitizer) {
          let fn = rule.sanitizer;
          if (typeof fn === 'string' && !this.valida.sanitizers[fn]) {
            fn = this.valida.sanitizers[fn];
          }

          if (!fn) {
            throw new Error(`invalid sanitizer ${rule.sanitizer}`);
          } else if (fn.required) {
            for (const required of fn.required) {
              if (rule[required] === undefined) {
                throw new Error(`missing required value for sanitizer ${rule.sanitizer}: ${required}`);
              }
            }
          }
        }

        if (rule.validator) {
          let fn = rule.validator;
          if (typeof fn === 'string') {
            fn = this.valida.validators[fn];
          }

          if (!fn) {
            throw new Error(`invalid validator ${rule.validator}`);
          } else if (fn.required) {
            for (const required of fn.required) {
              if (rule[required] === undefined) {
                throw new Error(`missing required value for sanitizer ${rule.sanitizer}: ${required}`);
              }
            }
          }
          if (fn === schema) {
            this.validateSchema(rule.schema);
          }
        }
      }
    }
  }

  /**
   *
   * @param {object} obj
   * @param {object} rules
   * @param {string|string[]} [groups]
   */
  process(obj, rules, groups) {
    groups = groups || [];
    groups = typeof groups === 'string' ? [groups] : groups;

    this.validateRules(rules);

    const ctx = new Context(this, obj, rules, groups);
    ctx.run();

    return ctx;
  }
};
