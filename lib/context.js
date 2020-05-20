module.exports = class Context {
  constructor(valida, obj, schema, groups, cb) {
    this.valida = valida;
    this.obj = obj;
    this.schema = schema;
    this.cb = cb;
    this.groups = typeof groups === 'string' ? [groups] : groups;

    this.status = {
      errors: {},
      valid: true,
    };
  }

  isValid() {
    return this.status && this.status.valid;
  }

  errors() {
    return (!this.status || this.status.valid) ? {} : this.status.errors;
  }

  addError(key, error) {
    this.status.errors[key] = this.status.errors[key] || [];
    this.status.errors[key].push(error);
    this.status.valid = false;
  }

  groupsValid(groups) {
    const checkGroupsEmpty = !this.groups || this.groups.length === 0;
    const ruleGroupsEmpty = !groups || groups.length === 0;

    if (checkGroupsEmpty && ruleGroupsEmpty) {
      return true;
    }
    if ((!checkGroupsEmpty && ruleGroupsEmpty) || (checkGroupsEmpty && !ruleGroupsEmpty)) {
      return true;
    }
    if (!checkGroupsEmpty && !ruleGroupsEmpty) {
      for (let i = 0, len = this.groups.length; i < len; i++) {
        if (groups.indexOf(this.groups[i]) !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  run() {
    // perform transformations and basic validation of passed schema
    for (const key in this.schema) {
      for (const rule of this.schema[key]) {
        if (rule.sanitizer) {
          let fn = rule.sanitizer;
          if (typeof fn === 'string') {
            fn = this.valida.sanitizers[fn];
          }

          if (!fn) {
            return this.cb(new Error(`invalid sanitizer ${rule.sanitizer}`));
          }
        }

        if (rule.validator) {
          let fn = rule.validator;
          if (typeof fn === 'string') {
            fn = this.valida.validators[fn];
          }

          if (!fn) {
            return this.cb(new Error(`invalid validator ${rule.validator}`));
          }
        }
      }
    }

    for (const key in this.schema) {
      const rules = this.schema[key];

      // sanitizers
      for (let i = 0, len = rules.length; i < len; i++) {
        if (!rules[i].sanitizer) {
          continue;
        }
        if (this.obj[key] === undefined) {
          continue;
        }
        if (!this.groupsValid(rules[i].groups)) {
          continue;
        }

        let fn = rules[i].sanitizer;
        if (typeof fn === 'string') {
          fn = this.valida.sanitizers[fn];
        }

        this.obj[key] = fn(this, rules[i], this.obj[key]);
      }
    }

    const asyncValidators = [];
    for (const key in this.schema) {
      const rules = this.schema[key];

      // validators
      for (let i = 0, len = rules.length; i < len; i++) {
        if (!rules[i].validator) {
          continue;
        }

        if (!this.groupsValid(rules[i].groups)) {
          continue;
        }

        let fn = rules[i].validator;
        if (typeof fn === 'string') {
          fn = this.valida.validators[fn];
        }

        if (fn.length == 4) {
          asyncValidators.push(new Promise((resolve, reject) => {
            fn(this, rules[i], this.obj[key], (err, result) => {
              if (err) {
                reject(err);
              }
              if (result !== undefined) {
                this.addError(key, result);
              }
              resolve();
            });
          }));
        } else {
          const result = fn(this, rules[i], this.obj[key]);
          if (result !== undefined) {
            this.addError(key, result);
          }
        }
      }
    }

    if (asyncValidators.length > 0) {
      Promise.all(asyncValidators).then(() => {
        this.cb(null, this);
      }).catch((err) => {
        this.cb(err, this);
      });
    } else {
      this.cb(null, this);
    }
  }
};
