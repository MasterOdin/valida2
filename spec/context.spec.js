const Context = require('../lib/context');
const valida = require('../lib');
const { toInt } = require('../lib/sanitizers');
const { range } = require('../lib/validators');
const expect = require('chai').expect;

describe('Context', () => {
  describe('string rules functions', () => {
    it('should pass with sanitize and validation', () => {
      const schema = {
        age: [
          {sanitizer: 'toInt'},
          {validator: 'range', min: 0, max: 51},
        ],
      };

      const obj = {age: '50'};
      const ctx = new Context(valida, obj, schema, []);
      const data = ctx.run();

      expect(obj.age).to.eql('50');
      expect(data.age).to.eql(50);
      expect(ctx.isValid()).to.be.true;
      expect(ctx.errors()).to.eql({});
    });
  });

  describe('rules using function definitions', () => {
    it('should pass with sanitize and validation', () => {
      const schema = {
        age: [
          {sanitizer: toInt},
          {validator: range, min: 0, max: 51},
        ],
      };

      const obj = {age: '50'};
      const ctx = new Context(valida, obj, schema, []);
      const data = ctx.run();

      expect(obj.age).to.eql('50');
      expect(data.age).to.eql(50);
      expect(ctx.isValid()).to.be.true;
      expect(ctx.errors()).to.eql({});
    });
  });

  describe('groups', () => {
    describe('groupsValid', () => {
      it('should pass with no groups used', () => {
        const ctx = new Context(valida, {}, {}, []);
        expect(ctx.groupsValid(undefined)).to.be.true;
      });

      it('should pass with no groups in constructor but groups in parameter', () => {
        const ctx = new Context(valida, {}, {}, []);
        expect(ctx.groupsValid(['foo'])).to.be.true;
        expect(ctx.groupsValid(['test'])).to.be.true;
      });

      it('should pass with no groups in parameter but groups in context', () => {
        const ctx = new Context(valida, {}, {}, ['foo']);
        expect(ctx.groupsValid(undefined)).to.be.true;
        expect(ctx.groupsValid([])).to.be.true;
      });

      describe('should only pass when groups in parameter match context', () => {
        const ctx = new Context(valida, {}, {}, ['foo', 'bar']);
        it('pass with all groups match', () => {
          expect(ctx.groupsValid(['foo', 'bar'])).to.be.true;
        });
        it('pass with only one group', () => {
          expect(ctx.groupsValid(['foo'])).to.be.true;
        });
        it('pass with one matching one not matching', () => {
          expect(ctx.groupsValid(['foo', 'baz'])).to.be.true;
        });
        it('not pass with none matching', () => {
          expect(ctx.groupsValid(['baz'])).to.be.false;
        });
      });
    });

    describe('group set only in schema', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt, groups: ['test']},
          {validator: valida.validators.range, min: 0, max: 49, groups: ['foo']},
        ],
      };

      it('should sanitize and validate', () => {
        const obj = {age: '50'};
        const ctx = new Context(valida, obj, schema, []);
        const data = ctx.run();

        expect(obj.age).to.eql('50');
        expect(data.age).to.eql(50);
        expect(ctx.isValid()).to.be.false;
        expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});

      });
    });

    describe('group passed into process', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt},
          {validator: valida.validators.range, min: 0, max: 49},
        ],
      };

      it('should sanitize and validate', () => {
        const obj = {age: '50'};
        const ctx = new Context(valida, obj, schema, ['foo']);
        const data = ctx.run();

        expect(obj.age).to.eql('50');
        expect(data.age).to.eql(50);
        expect(ctx.isValid()).to.be.false;
        expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
      });
    });

    describe('group set both in schema and passed into process', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt, groups: ['foo']},
          {validator: valida.validators.range, min: 0, max: 49, groups: ['bar']},
        ],
      };
      const obj = {age: '50'};

      it('should run rules that match at least one group in process', () => {
        const ctx = new Context(valida, obj, schema, ['baz', 'bar', 'foo']);
        const data = ctx.run();

        expect(obj.age).to.eql('50');
        expect(data.age).to.eql(50);
        expect(ctx.isValid()).to.be.false;
        expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
      });

      it('should exclude validation rules that do not match group', () => {
        const ctx = new Context(valida, obj, schema, ['foo']);
        const data = ctx.run();

        expect(obj.age).to.eql('50');
        expect(data.age).to.eql(50);
        expect(ctx.isValid()).to.be.true;
        expect(ctx.errors()).to.eql({});
      });

      it('should exclude validation rules that do not match group', () => {
        const obj = {age: 50.5};
        const ctx = new Context(valida, obj, schema, ['bar']);
        const data = ctx.run();

        expect(data.age).to.eql(50.5);
        expect(ctx.isValid()).to.be.false;
        expect(ctx.errors()).to.eql({age: [{validator: 'range', min: 0, max: 49}]});
      });

      it('should work passing group into process as string', () => {
        const ctx = new Context(valida, obj, schema, ['foo']);
        const data = ctx.run();

        expect(obj.age).to.eql('50');
        expect(data.age).to.eql(50);
        expect(ctx.isValid()).to.be.true;
        expect(ctx.errors()).to.eql({});
      });
    });
  });

  describe('errors', () => {
    it('passing invalid sanitizer', () => {
      const schema = {
        age: [
          {sanitizer: 'totally-invalid'},
        ],
      };
      const obj = {age: '50'};
      const ctx = new Context(valida, obj, schema, []);
      try {
        ctx.run();
        expect.fail('Error not returned');
      } catch (err) {
        expect(err.message).to.eql('invalid sanitizer totally-invalid');
        expect(obj).to.eql({age: '50'});
      }

    });

    it('passing invalid validator', () => {
      const schema = {
        age: [
          {validator: 'totally-invalid'},
        ],
      };
      const obj = {age: '50'};
      const ctx = new Context(valida, obj, schema, []);
      try {
        ctx.run();
        expect.fail('Error not returned');
      } catch (err) {
        expect(err.message).to.eql('invalid validator totally-invalid');
        expect(obj).to.eql({age: '50'});
      }
    });

    it('passing valid sanitizer and invalid validator should not affect data', () => {
      const schema = {
        age: [
          {sanitizer: valida.Sanitizer.toInt},
          {validator: 'totally-invalid'},
        ],
      };
      const obj = {age: '50'};
      const ctx = new Context(valida, obj, schema, []);
      try {
        ctx.run();
        expect.fail('Error not returned');
      } catch (err) {
        expect(err.message).to.eql('invalid validator totally-invalid');
        expect(obj).to.eql({age: '50'});
      }
    });

    it('should bubble to error', () => {
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

      const ctx = new Context(valida, data, schema, []);
      try {
        ctx.run();
        expect.fail('no exception thrown');
      } catch (err) {
        expect(err.message).to.eql('invalid validator not-a-real-validator');
      }
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
    it('should not sanitize undefined value', () => {
      const obj = {age: undefined};
      const ctx = new Context(valida, obj, schema, []);
      const data = ctx.run();
      expect(data.age).to.be.undefined;
      expect(ctx.isValid()).to.be.true;
    });
  });
});
