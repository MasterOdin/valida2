const validators = require('../lib/validators');
const expect = require('chai').expect;

describe('validators', () => {
  describe('.required', () => {
    it('undefined should return value', () => {
      expect(validators.required(undefined)).to.eql({validator: 'required'});
    });

    it('null should return value', () => {
      expect(validators.required(null)).to.eql({validator: 'required'});
    });

    ['', 0, {}, []].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.required(value)).to.be.undefined;
      });
    });
  });

  describe('.notEmpty', () => {
    [undefined, null, 'aa', ['aa']].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.notEmpty(value)).to.be.undefined;
      });
    });

    [[], ''].forEach((value) => {
      it(`should not validate empty ${JSON.stringify(value)}`, () => {
        expect(validators.notEmpty(value)).to.eql({validator: 'notEmpty'});
      });
    });
  });

  describe('.empty', () => {
    [undefined, null, [], ''].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.empty(value)).to.be.undefined;
      });
    });

    ['aa', ['aa']].forEach((value) => {
      it(`should not validate non-empty ${JSON.stringify(value)}`, () => {
        expect(validators.empty(value)).to.eql({validator: 'empty'});
      });
    });
  });

  describe('.float', () => {
    [undefined, null, 123.423].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.float(value)).to.be.undefined;
      });
    });

    [123, 123.0].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.float(value)).to.eql({
          validator: 'float',
          msg: 'Invalid float value.',
        });
      });
    });
  });
});
