const Context = require('./context');

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

  process(obj, schema, groups, cb) {
    if (!cb && groups && typeof groups === 'function') {
      cb = groups;
      groups = [];
    }

    if (!cb) {
      return new Promise((resolve, reject) => {
        const ctx = new Context(this, obj, schema, groups, (err, ctx) => {
          if (err) {
            return reject(err);
          }
          resolve(ctx);
        });
        ctx.run();
      });
    } else {
      const ctx = new Context(this, obj, schema, groups, (err, ctx) => {
        cb(err, ctx);
      });
      ctx.run();
    }
  }
};
