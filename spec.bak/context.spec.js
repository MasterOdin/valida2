const Context = require('../lib/context');
const valida = require('../lib');
const expect = require('chai').expect;

describe('Context', () => {
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
        const ctx = new Context(valida, data, schema, [], (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
        ctx.run();
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
        const ctx = new Context(valida, data, schema, ['foo'], (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
        ctx.run();
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
        const ctx = new Context(valida, data, schema, ['baz', 'bar', 'foo'], (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
        ctx.run();
      });

      it('should exclude validation rules that do not match group', (done) => {
        const ctx = new Context(valida, data, schema, ['foo'], (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.true;
          expect(ctx.errors()).to.eql({});
          done();
        });
        ctx.run();
      });

      it('should exclude validation rules that do not match group', (done) => {
        const data = {age: 50.5};
        const ctx = new Context(valida, data, schema, ['bar'], (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50.5);
          expect(ctx.isValid()).to.be.false;
          expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
          done();
        });
        ctx.run();
      });

      it('should work passing group into process as string', (done) => {
        const ctx = new Context(valida, data, schema, ['foo'], (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          expect(ctx.isValid()).to.be.true;
          expect(ctx.errors()).to.eql({});
          done();
        });
        ctx.run();
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
      const ctx = new Context(valida, data, schema, [], (err) => {
        if (!err) {
          expect.fail('Error not returned');
        }
        expect(err.message).to.eql('invalid sanitizer totally-invalid');
        expect(data).to.eql({age: '50'});
        done();
      });
      ctx.run();
    });

    it('passing invalid validator', (done) => {
      const schema = {
        age: [
          {validator: 'totally-invalid'},
        ],
      };
      const data = {age: '50'};
      const ctx = new Context(valida, data, schema, [], (err) => {
        if (!err) {
          expect.fail('Error not returned');
        }
        expect(err.message).to.eql('invalid validator totally-invalid');
        expect(data).to.eql({age: '50'});
        done();
      });
      ctx.run();
    });

    it('passing valid sanitizer and invalid validator should not affect data', (done) => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt},
          {validator: 'totally-invalid'},
        ],
      };
      const data = {age: '50'};
      const ctx = new Context(valida, data, schema, [], (err) => {
        if (!err) {
          expect.fail('Error not returned');
        }
        expect(err.message).to.eql('invalid validator totally-invalid');
        expect(data).to.eql({age: '50'});
        done();
      });
      ctx.run();
    });
  });

  describe('undefined values', () => {
    const schema = {
      age: [
        {
          sanitizer: valida.Sanitizer.toInt,
          validator: valida.validators.empty,
        },
      ],
    };
    it('should not sanitize undefined value', (done) => {
      const data = {age: undefined};
      const ctx = new Context(valida, data, schema, [], (err) => {
        if (err) {
          return done(err);
        }
        expect(data.age).to.be.undefined;
        expect(ctx.isValid()).to.be.true;
        done();
      });
      ctx.run();
    });
  });

  describe('async validator error', () => {
    it('should bubble to error', (done) => {
      const schema = {
        fruits: [
          {
            validator: valida.Validator.schema,
            schema: {
              type: [{validator: 'not-a-real-validator'}],
            },
          },
        ],
      };
      const data = {
        fruits: [
          {
            type: 'apple',
            cost: 1.11,
          },
          {
            type: 'orange',
            cost: 2.23,
          },
        ],
      };

      const ctx = new Context(valida, data, schema, [], (err, ctx) => {
        if (!err) {
          expect.fail();
        }
        expect(err.message).to.eql('');
        expect(ctx.isValid());
        done();
      });
      ctx.run();
    });
  });
});
