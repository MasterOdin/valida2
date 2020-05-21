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

    [['', "''"], [0, '0'], [{}, '{}'], [[], '[]']].forEach(([value, repr]) => {
      it(`should validate ${repr}`, () => {
        expect(validators.required(value)).to.be.undefined;
      });
    });
  });
});
