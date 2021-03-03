const cloneDeep = require('lodash/cloneDeep');

module.exports = class Context {
  /**
   *
   * @param {Valida} valida
   * @param {object} obj
   * @param {object} rules
   * @param {string[]} groups
   */
  constructor(valida, obj, rules, groups) {
    this.valida = valida;
    this.obj = obj;
    this.rules = rules;
    this.groups = groups;

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

  /**
   *
   * @param {string[]|undefined} groups
   */
  groupsValid(groups = []) {
    const checkGroupsEmpty = !this.groups || this.groups.length === 0;
    const ruleGroupsEmpty = !groups || groups.length === 0;

    if (checkGroupsEmpty && ruleGroupsEmpty) {
      return true;
    }
    if ((!checkGroupsEmpty && ruleGroupsEmpty) || (checkGroupsEmpty && !ruleGroupsEmpty)) {
      return true;
    }

    for (let i = 0, len = this.groups.length; i < len; i++) {
      if (groups.indexOf(this.groups[i]) !== -1) {
        return true;
      }
    }

    return false;
  }

  run() {
    const obj = cloneDeep(this.obj);
    for (const key in this.rules) {
      const rule = this.rules[key];

      // sanitizers
      for (let i = 0, len = rule.length; i < len; i++) {
        if (!rule[i].sanitizer) {
          continue;
        }

        if (obj[key] === undefined || obj[key] === null) {
          continue;
        }

        if (!this.groupsValid(rule[i].groups)) {
          continue;
        }

        let fn = rule[i].sanitizer;
        if (typeof fn === 'string') {
          fn = this.valida.sanitizers[fn];
        }
        if (!fn) {
          throw new Error(`invalid sanitizer ${rule[i].sanitizer}`);
        }

        obj[key] = fn(obj[key], rule[i], this);
      }
    }

    for (const key in this.rules) {
      const rule = this.rules[key];

      // validators
      for (let i = 0, len = rule.length; i < len; i++) {
        if (!rule[i].validator) {
          continue;
        }

        if (!this.groupsValid(rule[i].groups)) {
          continue;
        }

        let fn = rule[i].validator;
        if (typeof fn === 'string') {
          fn = this.valida.validators[fn];
        }
        if (!fn) {
          throw new Error(`invalid validator ${rule[i].validator}`);
        }

        const result = fn(obj[key], rule[i], this);
        if (!result) {
          const error = cloneDeep(rule[i]);
          error.validator = fn.displayName;
          delete error.groups;
          delete error.sanitizer;
          this.addError(key, error);
        }
      }
    }

    return obj;
  }
};
