const validators = require('../lib/validators');
const expect = require('chai').expect;

describe('validators', () => {
  describe('.required', () => {
    it('should have displayName "required"', () => {
      expect(validators.required.displayName).to.be.eql('required');
    });

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
      {pattern: /st$/},
      {pattern: new RegExp(/ES/, 'i')},
      {pattern: 'eS', modifiers: 'i'},
    ].forEach((options) => {
      it(`should validate test for ${options.pattern.toString()} (modifiers: ${options.modifiers || ''})`, () => {
        expect(validators.regex('test', options)).to.be.true;
      });
    });

    it('should coerce to string and then validate', () => {
      expect(validators.regex(12345, {pattern: /[0-5]+/})).to.be.true;
    });

    it('should not validate test for /tset/', () => {
      expect(validators.regex('test', {pattern: /tset/})).to.be.false;
    });
  });

  describe('.len', () => {
    [undefined, null].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.len(value, {})).to.be.true;
      });
    });

    [
      ['test', {}],
      [['test'], {}],
      [12345, {min: 1}],
      ['test', {min: 1}],
      ['test', {min: 4}],
      ['test', {max: 5}],
      ['test', {max: 4}],
      [[1,2,3,4], {min: 1}],
      ['test', {min: 1, max: 5}],
      [[1,2,3,4], {min: 1, max: 5}],
    ].forEach(([value, options]) => {
      it(`should validate ${JSON.stringify(value)} with ${JSON.stringify(options)}`, () => {
        expect(validators.len(value, options)).to.be.true;
      });
    });

    [
      ['test', {min: 5}],
      ['test', {max: 3}],
      [[1,2,3,4], {min: 5}],
      ['test', {min: 1, max: 3}],
      ['test', {min: 5, max: 6}],
    ].forEach(([value, options]) => {
      it(`should not validate ${JSON.stringify(value)} with ${JSON.stringify(options)}`, () => {
        expect(validators.len(value, options)).to.be.false;
      });
    });
  });

  describe('.array', () => {
    [undefined, null].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.array(value, {})).to.be.true;
      });
    });
    [[], ['test']].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.array(value)).to.be.true;
      });
    });


    ['test', 123, {}, true].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.array(value)).to.be.false;
      });
    });
  });

  describe('.plainObject', () => {
    [undefined, null, {}, {a: true}].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.plainObject(value)).to.be.true;
      });
    });

    ['a', true, 0, []].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.plainObject(value)).to.be.false;
      });
    });
  });

  describe('.date', () => {
    [undefined, null, new Date()].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.date(value)).to.be.true;
      });
    });

    ['a', true, [], {}, Date.now()].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.date(value)).to.be.false;
      });
    });
  });

  describe('.integer', () => {
    [undefined, null, -1, 0, 10].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.integer(value)).to.be.true;
      });
    });

    ['a', true, 10.5].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.integer(value)).to.be.false;
      });
    });
  });

  describe('.enum', () => {
    [undefined, null].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.enum(value)).to.be.true;
      });
    });

    it('should validate', () => {
      expect(validators.enum('blue', {items: ['red', 'green', 'blue']})).to.be.true;
    });

    it('should not validate', () => {
      expect(validators.enum('blue', {items: ['red', 'green', 'yellow']})).to.be.false;
    });
  });

  describe('.bool', () => {
    [undefined, null, false, true].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.bool(value)).to.be.true;
      });
    });

    ['a', [], {}, new Date()].forEach((value) => {
      it(`should not validate ${JSON.stringify(value)}`, () => {
        expect(validators.bool(value)).to.be.false;
      });
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

  describe('.range', () => {
    [undefined, null].forEach((value) => {
      it(`should validate ${JSON.stringify(value)}`, () => {
        expect(validators.range(value)).to.be.true;
      });
    });

    [0,1,2].forEach((value) => {
      it(`should validate ${value} with min`, () => {
        expect(validators.range(value, {max: 2})).to.be.true;
      });

      it(`should validate ${value} with max`, () => {
        expect(validators.range(value, {max: 2})).to.be.true;
      });

      it(`should validate ${value} with min and max`, () => {
        expect(validators.range(value, {min: 0, max: 2})).to.be.true;
      });
    });

    it('should not validate -1 with min', () => {
      expect(validators.range(-1, {min: 0})).to.be.false;
    });

    it('should not validate 3 with max', () => {
      expect(validators.range(3, {max: 2})).to.be.false;
    });

    [-1, 3].forEach((value) => {
      it(`should not validate ${value} with min and max`, () => {
        expect(validators.range(value, {min: 0, max: 2})).to.be.false;
      });
    });
  });
});
