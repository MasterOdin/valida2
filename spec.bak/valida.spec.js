const expect = require('chai').expect;

const valida = require('../lib');
const Valida = require('../lib/valida');

describe('valida', () => {
  describe('return interfaces', () => {
    const schema = {
      age: [{sanitizer: valida.Sanitizer.toInt}],
    };
    const data = {age: '50'};

    describe('callback interface', () => {
      it('use callback if third arg is function', (done) => {
        valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          done();
        });
      });

      it('use callback if fourth arg is function', (done) => {
        valida.process(data, schema, [], (err) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          done();
        });
      });

      it('use callback to catch error', (done) => {
        valida.process(data, {age: [{validator: 'foo bar baz'}]}, (err) => {
          expect(err).to.not.be.undefined;
          expect(err.message).to.eql('invalid validator foo bar baz');
          done();
        });
      });
    });

    describe('promise interface', () => {
      it('use promise if no third or fourth arg', (done) => {
        valida.process(data, schema).then(() => {
          expect(data.age).to.eql(50);
          done();
        }).catch((err) => done(err));
      });

      it('use promise if third arg is non-function', (done) => {
        valida.process(data, schema, []).then(() => {
          expect(data.age).to.eql(50);
          done();
        }).catch((err) => done(err));
      });

      it('catch errors for promise', (done) => {
        valida.process(data, {age: [{validator: 'invalid-validator'}]}).then(() => {
          expect.fail('Error not returned');
        }).catch((err) => {
          expect(err.message).to.eql('invalid validator invalid-validator');
          done();
        });
      });
    });
  });

  describe('setValidators', () => {
    const check = new Valida();
    expect(check.validators).to.be.empty;
    const validatorSet = {
      'checkRequired': valida.validators.required,
      'isEmpty': valida.validators.empty,
    };
    check.setValidators(validatorSet);

    expect(check.validators).to.eql(validatorSet);
  });

  describe('setSanitizers', () => {
    const check = new Valida();
    expect(check.sanitizers).to.be.empty;
    const sanitizerSet = {
      'toInteger': valida.sanitizers.toInt,
    };
    check.setSanitizers(sanitizerSet);
    expect(check.sanitizers).to.eql(sanitizerSet);
  });
});
