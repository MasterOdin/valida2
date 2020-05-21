const Valida = require('../');
const expect = require('chai').expect;

describe('sanitizers', () => {
  describe('toInt', () => {
    const schema = {
      age: [
        { sanitizer: Valida.Sanitizer.toInt },
      ],
    };

    describe('given is a string data of a valid integer number', () => {
      it('should set the field with the converted int value', (done) => {
        const data = { age: '50' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql(50);
          done();
        });
      });
    });

    describe('given is a string data of a invalid integer number', () => {
      it('should set the field with the result of the failed convertion', (done) => {
        const data = { age: 'x50' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.be.NaN;
          done();
        });
      });
    });
  });

  describe('toFloat', () => {
    const schema = {
      price: [
        { sanitizer: Valida.Sanitizer.toFloat },
      ],
    };

    describe('given is a string data of a valid float number', () => {
      it('should set the field with the converted float value', (done) => {
        const data = { price: '50.10' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.price).to.eql(50.10);
          done();
        });
      });

      it('should set the field with converted float value at precision 1', (done) => {
        const testSchema = JSON.parse(JSON.stringify(schema));
        testSchema.price[0].precision = 1;
        const data = { price: '50.15' };
        Valida.process(data, testSchema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.price).to.eql(50.1);
          done();
        });
      });
    });

    describe('given is a string data of a invalid float number', () => {
      it('should set the field with the result of the failed convertion', (done) => {
        const data = { price: 'x50' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.price).to.be.NaN;
          done();
        });
      });
    });
  });

  describe('toDate', () => {
    const schema = {
      createdAt: [
        { sanitizer: Valida.Sanitizer.toDate },
      ],
    };

    describe('given is a string data of a valid date', () => {
      it('should set the field with the converted date value', (done) => {
        const date = new Date();
        const data = { createdAt: date.toISOString() };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.createdAt).to.eql(date);
          done();
        });
      });
    });

    describe('given is a string data of a invalid date', () => {
      it('should set the field with the result of the failed convertion', (done) => {
        const data = { createdAt: '----' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.createdAt).to.be.NaN;
          done();
        });
      });
    });
  });

  describe('trim', () => {
    const schema = {
      name: [
        { sanitizer: Valida.Sanitizer.trim },
      ],
    };

    describe('given is a string data with whitespaces around it', () => {
      it('should set the field with no whitespaces arount id', (done) => {
        const data = { name: '   Jack   ' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.name).to.eql('Jack');
          done();
        });
      });
    });
  });

  describe('string', () => {
    const schema = {
      age: [
        { sanitizer: Valida.Sanitizer.string },
      ],
    };

    describe('given is a interger data', () => {
      it('should set the field with the converted string value', (done) => {
        const data = { age: 100 };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.age).to.eql('100');
          done();
        });
      });
    });
  });

  describe('lowerCase', () => {
    const schema = {
      text: [
        { sanitizer: Valida.Sanitizer.lowerCase },
      ],
    };

    describe('given is a string data with letters in all diferent cases', () => {
      it('should set the field with lower case', (done) => {
        const data = { text: 'My Name is Jack. OK?!' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.text).to.eql('my name is jack. ok?!');
          done();
        });
      });
    });
  });

  describe('titleCase', () => {
    const schema = {
      text: [
        { sanitizer: Valida.Sanitizer.titleCase },
      ],
    };

    describe('given is a string data with letters in all diferent cases', () => {
      it('should set the field with title case', (done) => {
        const data = { text: 'my name is Jack. OK?!' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.text).to.eql('My Name Is Jack. OK?!');
          done();
        });
      });
    });
  });

  describe('upperCaseFirst', () => {
    const schema = {
      text: [
        { sanitizer: Valida.Sanitizer.upperCaseFirst },
      ],
    };

    describe('given is a string data with letters in all diferent cases', () => {
      it('should set the field with title case', (done) => {
        const data = { text: 'my name is Jack. OK?!' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.text).to.eql('My name is Jack. OK?!');
          done();
        });
      });
    });
  });

  describe('upperCase', () => {
    const schema = {
      text: [
        { sanitizer: Valida.Sanitizer.upperCase },
      ],
    };

    describe('given is a string data with letters in all diferent cases', () => {
      it('should set the field with title case', (done) => {
        const data = { text: 'my name is Jack. OK?!' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.text).to.eql('MY NAME IS JACK. OK?!');
          done();
        });
      });
    });
  });

  describe('toBool', () => {
    const schema = {
      published: [
        { sanitizer: Valida.Sanitizer.toBool },
      ],
    };

    describe('given is a string "true"', () => {
      it('should set the field with "true" bool value', (done) => {
        const data = { published: 'true' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.published).to.eql(true);
          done();
        });
      });
    });

    describe('given is a string "false"', () => {
      it('should set the field with "false" bool value', (done) => {
        const data = { published: 'false' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.published).to.eql(false);
          done();
        });
      });
    });

    describe('given is a string with an invalid bool value', () => {
      it('should set the field with "false" bool value', (done) => {
        const data = { published: 'NOPE' };

        Valida.process(data, schema, (err) => {
          if (err) {
            return done(err);
          }
          expect(data.published).to.eql(false);
          done();
        });
      });
    });
  });
});
