const Valida = require('./valida');
const valida = new Valida();

valida.Sanitizer = {};
valida.Validator = {};

const sanitizers = require('./sanitizers');
Object.keys(sanitizers).forEach((key) => {
  valida.Sanitizer[key] = key;
  valida.setSanitizer(key, sanitizers[key]);
});

const validators = require('./validators');
Object.keys(validators).forEach((key) => {
  valida.Validator[key] = key;
  valida.setValidator(key, validators[key]);
});

module.exports = valida;
