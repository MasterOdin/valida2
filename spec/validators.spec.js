const Valida = require('../');
const expect = require('chai').expect;

describe('validators', () => {
  describe('required', () => {
    const schema = {
      name: [
        { validator: Valida.Validator.required },
      ],
    };

    describe('given the field is present in the data', () => {
      it('should consider valid', (done) => {
        const data = { name: 'Jack' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field is not present in the data', () => {
      it('should consider invalid', (done) => {
        const data = { };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('empty', () => {
    const schema = {
      name: [
        { validator: Valida.Validator.empty },
      ],
    };

    describe('given the field is not empty', () => {
      it('should consider valid', (done) => {
        const data = { name: 'Jack' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field is empty', () => {
      it('should consider invalid', (done) => {
        const data = { name: '' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('regex', () => {
    const schema = {
      name: [
        { validator: Valida.Validator.regex, pattern: '[A-Z]', modifiers: 'i' },
      ],
    };

    describe('given the field matches the regex pattern', () => {
      it('should consider valid', (done) => {
        const data = { name: 'Jack' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field does not match the regex pattern', () => {
      it('should consider invalid', (done) => {
        const data = { name: '1111' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('len', () => {
    const schema = {
      fruits: [
        { validator: Valida.Validator.len, min: 2, max: 3 },
      ],
    };

    describe('given an array that matches the expected length', () => {
      it('should consider valid', (done) => {
        const data = { fruits: ['apple', 'orange'] };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given and array that does not match the expected length', () => {
      it('should consider invalid when min is not right', (done) => {
        const data = { fruits: ['apple'] };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });

      it('should consider invalid when max is not right', (done) => {
        const data = { fruits: ['apple', 'orange', 'banana', 'watermelon'] };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });

    describe('given a string that matches the expected length', () => {
      it('should consider valid', (done) => {
        const data = { fruits: 'fig' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given and array that does not match the expected length', () => {
      it('should consider invalid when min is not right', (done) => {
        const data = { fruits: 'x' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });

      it('should consider invalid when max is not right', (done) => {
        const data = { fruits: 'coconut' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('array', () => {
    const schema = {
      fruits: [
        { validator: Valida.Validator.array },
      ],
    };

    describe('given the field is an array', () => {
      it('should consider valid', (done) => {
        const data = { fruits: ['orange'] };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field is not an array', () => {
      it('should consider invalid', (done) => {
        const data = { fruits: 'orange' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('schema', () => {
    const schema = {
      fruits: [
        {
          validator: Valida.Validator.schema,
          schema: {
            type: [{validator: Valida.Validator.required}],
            cost: [{validator: Valida.Validator.required}, {validator: Valida.Validator.float}],
          },
        },
      ],
    };

    it('should consider valid', (done) => {
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

      Valida.process(data, schema, (err, ctx) => {
        if (err) {
          return done(err);
        }
        expect(ctx.isValid()).to.eql(true);
        done();
      });
    });

    it('should consider invalid', (done) => {
      const data = {
        fruits: [
          {
            type: 'apple',
            cost: 'a',
          },
          {
            type: 'orange',
            cost: 2.23,
          },
        ],
      };

      Valida.process(data, schema, (err, ctx) => {
        if (err) {
          return done(err);
        }
        expect(ctx.isValid()).to.eql(false);
        done();
      });
    });
  });

  describe('plainObject', () => {
    const schema = {
      user: [
        { validator: Valida.Validator.plainObject },
      ],
    };

    describe('given the field is a plain object', () => {
      it('should consider valid', (done) => {
        const data = { user: { name: 'Jack' } };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field is not a plain object', () => {
      it('should consider invalid', (done) => {
        const data = { user: [{ name: 'Jack' }] };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('date', () => {
    const schema = {
      createdAt: [
        { validator: Valida.Validator.date },
      ],
    };

    describe('given the field is a date', () => {
      it('should consider valid', (done) => {
        const data = { createdAt: new Date() };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field is not a date', () => {
      it('should consider invalid', (done) => {
        const data = { createdAt: 'nope' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('integer', () => {
    const schema = {
      age: [
        { validator: Valida.Validator.integer },
      ],
    };

    describe('given the field is a integer', () => {
      it('should consider valid', (done) => {
        const data = { age: 45 };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given the field is not a integer', () => {
      it('should consider invalid', (done) => {
        const data = { age: 'nope' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('enum', () => {
    const schema = {
      fruit: [
        { validator: Valida.Validator.enum, items: ['apple', 'orange'] },
      ],
    };

    describe('given a value that exists in the enum', () => {
      it('should consider valid', (done) => {
        const data = { fruit: 'orange' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given a value that does not exist in the enum', () => {
      it('should consider invalid', (done) => {
        const data = { fruit: 'watermelon' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('bool', () => {
    const schema = {
      published: [
        { validator: Valida.Validator.bool },
      ],
    };

    describe('given a value true of bool type', () => {
      it('should consider valid', (done) => {
        const data = { published: true };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given a value false of bool type', () => {
      it('should consider valid', (done) => {
        const data = { published: false };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given a value true of string type', () => {
      it('should consider invalid', (done) => {
        const data = { published: 'true' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('float', () => {
    const schema = {
      salary: [
        { validator: Valida.Validator.float },
      ],
    };

    describe('given a value 1.20 of "float" type', () => {
      it('should consider valid', (done) => {
        const data = { salary: 1.20 };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });
    });

    describe('given a value 1.20 of string type', () => {
      it('should consider invalid', (done) => {
        const data = { salary: '1.20' };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(false);
          done();
        });
      });
    });
  });

  describe('range', () => {
    describe('given a schema with both min and max values', () => {
      const schema = {
        code: [
          { validator: Valida.Validator.range, min: 0, max: 10 },
        ],
      };

      describe('given a value smaller than the min value', () => {
        it ('should consider invalid', (done) => {
          const data = { code: -10 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(false);
            expect(ctx.errors()).to.eql({code: [{validator: 'range', min: 0, max: 10}]});
            done();
          });
        });
      });

      describe('given a value bigger than the max value', () => {
        it ('should consider invalid', (done) => {
          const data = { code: 20 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(false);
            done();
          });
        });
      });

      describe('given a value between the min and max value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 5 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });

      describe('given a value equal to the min value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 0 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });

      describe('given a value equal to the max value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 10 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });
    });

    describe('given a schema with only min value', () => {
      const schema = {
        code: [
          { validator: Valida.Validator.range, min: 0 },
        ],
      };

      describe('given a value smaller than the min value', () => {
        it ('should consider invalid', (done) => {
          const data = { code: -10 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(false);
            done();
          });
        });
      });

      describe('given a value bigger than the min value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 5 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });

      describe('given a value equal to the min value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 0 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });
    });

    describe('given a schema with only max value', () => {
      const schema = {
        code: [
          { validator: Valida.Validator.range, max: 10 },
        ],
      };

      describe('given a value bigger than the max value', () => {
        it ('should consider invalid', (done) => {
          const data = { code: 20 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(false);
            done();
          });
        });
      });

      describe('given a value smaller than the max value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 5 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });

      describe('given a value equal to the max value', () => {
        it ('should consider valid', (done) => {
          const data = { code: 10 };

          Valida.process(data, schema, (err, ctx) => {
            if (err) {
              return done(err);
            }
            expect(ctx.isValid()).to.eql(true);
            done();
          });
        });
      });
    });
  });

  describe('custom', () => {
    const schema = {
      age: [
        {
          validator: Valida.Validator.custom,
          validation: (value) => value > 18,
          key: 'older than 18',
          msg: 'you must be older than 18',
        },
      ],
    };

    describe('given a valid validation function', () => {
      it('should consider valid values', (done) => {
        const data = { age: 21 };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }
          expect(ctx.isValid()).to.eql(true);
          done();
        });
      });

      it('should return error key and message for invalid values', (done) => {
        const data = { age: 15 };

        Valida.process(data, schema, (err, ctx) => {
          if (err) {
            return done(err);
          }

          expect(ctx.isValid()).to.eql(false);
          const errors = ctx.status.errors.age[0];
          expect(errors.validator).to.eql('older than 18');
          expect(errors.msg).to.eql('you must be older than 18');

          done();
        });
      });
    });
  });
});
