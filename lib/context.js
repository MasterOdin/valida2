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
    for (const key in this.rules) {
      const rules = this.rules[key];

      // sanitizers
      for (let i = 0, len = rules.length; i < len; i++) {
        if (!rules[i].sanitizer) {
          continue;
        }

        if (this.obj[key] === undefined || this.obj[key] === null) {
          continue;
        }

        if (!this.groupsValid(rules[i].groups)) {
          continue;
        }

        let fn = rules[i].sanitizer;
        if (typeof fn === 'string') {
          fn = this.valida.sanitizers[fn];
        }

        this.obj[key] = fn(this.obj[key], rules[i], this);
      }
    }

    for (const key in this.rules) {
      const rules = this.rules[key];

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

        const result = fn(this.obj[key], rules[i], this);
        if (result !== undefined) {
          result.msg = rules[i].msg || result.msg;
          result.validator = result.validator || fn.name;
          this.addError(key, result);
        }
      }
    }
  }
};
