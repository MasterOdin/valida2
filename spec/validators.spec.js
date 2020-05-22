const validators = require('../lib/validators');
const expect = require('chai').expect;

describe('validators', () => {
  describe('.required', () => {
    it('undefined should return value', () => {
      expect(validators.required(undefined)).to.be.false;
    });

    it('null should return value', () => {
      expect(validators.required(null)).to.be.false;
    });

    ['', 0, {}, []].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.required(value)).to.be.true;
      });
    });
  });

  describe('.notEmpty', () => {
    [undefined, null, 'aa', ['aa']].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.notEmpty(value)).to.be.true;
      });
    });

    [[], ''].forEach((value) => {
      it(`should not validate empty ${JSON.stringify(value)}`, () => {
        expect(validators.notEmpty(value)).to.be.false;
      });
    });
  });

  describe('.empty', () => {
    [undefined, null, [], ''].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.empty(value)).to.be.true;
      });
    });

    ['aa', ['aa']].forEach((value) => {
      it(`should not validate non-empty ${JSON.stringify(value)}`, () => {
        expect(validators.empty(value)).to.be.false;
      });
    });
  });

  describe('.regex', () => {
    [undefined, null].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.regex(value, {})).to.be.true;
      });
    });

    [
      {pattern: /^te(st)t*$/},
      {pattern: /st$/, modifiers: 'g'},
      {pattern: new RegExp(/ES/, 'i')},
    ].forEach((options) => {
      it(
        `should validate test for ${options.pattern.toString()} (modifiers: ${options.modifiers || ''})`,
        () => {
          expect(validators.regex('test', options)).to.be.true;
        },
      );
    });

    it('should not validate test for /tset/', () => {
      expect(validators.regex('test', {pattern: /tset/})).to.be.false;
    });
  });

  describe('.float', () => {
    [undefined, null, 123.423].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.float(value)).to.be.true;
      });
    });

    [123, 123.0].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.float(value)).to.be.false;
      });
    });
  });
});
