const expect = require('chai').expect;

const valida = require('../');
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
          done(false);
        }).catch((err) => {
          expect(err.message).to.eql('invalid validator invalid-validator');
          done();
        });
      });
    });
  });

  describe('groups', () => {
    describe('group set only in schema', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt, groups: ['test']},
          {validator: valida.validators.range, min: 0, max: 49, groups: ['foo']},
        ],
      };

      it('should sanitize and validate', (done) => {
        const data = {age: '50'};
        valida.process(data, schema, (err, ctx) => {
          if (err) {
            done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
      });
    });

    describe('group passed into process', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt},
          {validator: valida.validators.range, min: 0, max: 49},
        ],
      };

      it('should sanitize and validate', (done) => {
        const data = {age: '50'};
        valida.process(data, schema, ['foo'], (err, ctx) => {
          if (err) {
            done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
      });
    });

    describe('group set both in schema and passed into process', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt, groups: ['foo']},
          {validator: valida.validators.range, min: 0, max: 49, groups: ['bar']},
        ],
      };
      const data = {age: '50'};

      it('should run rules that match at least one group in process', (done) => {
        valida.process(data, schema, ['baz', 'bar', 'foo'], (err, ctx) => {
          if (err) {
            done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
      });

      it('should exclude validation rules that do not match group', (done) => {
        valida.process(data, schema, ['foo'], (err, ctx) => {
          if (err) {
            done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.true;
          expect(ctx.errors()).to.eql({});
          done();
        });
      });

      it('should exclude validation rules that do not match group', (done) => {
        const data = {age: 50.5};
        valida.process(data, schema, ['bar'], (err, ctx) => {
          if (err) {
            done(err);
          }
          expect(data.age).to.eql(50.5);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
      });

      it('should work passing group into process as string', (done) => {
        valida.process(data, schema, 'foo', (err, ctx) => {
          if (err) {
            done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.true;
          expect(ctx.errors()).to.eql({});
          done();
        });
      });
    });
  });

  describe('errors', () => {
    it('passing invalid sanitizer', (done) => {
      const schema = {
        age: [
          {sanitizer: 'totally-invalid'},
        ],
      };
      const data = {age: '50'};
      valida.process(data, schema, (err) => {
        if (!err) {
          done(false);
        }
        expect(err.message).to.eql('invalid sanitizer totally-invalid');
        expect(data).to.eql({age: '50'});
        done();
      });
    });

    it('passing invalid validator', (done) => {
      const schema = {
        age: [
          {validator: 'totally-invalid'},
        ],
      };
      const data = {age: '50'};
      valida.process(data, schema, (err) => {
        if (!err) {
          done(false);
        }
        expect(err.message).to.eql('invalid validator totally-invalid');
        expect(data).to.eql({age: '50'});
        done();
      });
    });

    it('passing valid sanitizer and invalid validator should not affect data', (done) => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt},
          {validator: 'totally-invalid'},
        ],
      };
      const data = {age: '50'};
      valida.process(data, schema, (err) => {
        if (!err) {
          done(false);
        }
        expect(err.message).to.eql('invalid validator totally-invalid');
        expect(data).to.eql({age: '50'});
        done();
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
