const sanitizers = require('../lib/sanitizers');
const expect = require('chai').expect;

describe('sanitizers', () => {
  describe('.toInt', () => {
    it('converts string to integer', () => {
      expect(sanitizers.toInt('5.5')).to.eql(5);
    });

    it('converts integer to integer', () => {
      expect(sanitizers.toInt(5)).to.eql(5);
    });

    it('converts float to integer', () => {
      expect(sanitizers.toInt(5.5)).to.eql(5);
    });

    it('allows specifying radix', () => {
      expect(sanitizers.toInt('1F', {radix: 16})).to.eql(31);
    });

    it('returns NaN for invalid numbers', () => {
      expect(sanitizers.toInt('aaa')).to.be.NaN;
    });
  });

  describe('.toFloat', () => {
    it('converts string to float', () => {
      expect(sanitizers.toFloat('5.23')).to.eql(5.23);
    });

    it('converts integer to float', () => {
      expect(sanitizers.toFloat(5)).to.eql(5.0);
    });

    it('converts float to float', () => {
      expect(sanitizers.toFloat(5.5)).to.eql(5.5);
    });

    it('truncates and rounds down float based on precision', () => {
      expect(sanitizers.toFloat('1234.122', {precision: 1})).to.eql(1234.1);
    });

    it('truncates and rounds up float based on precision', () => {
      expect(sanitizers.toFloat('1123.126456', {precision: 2})).to.eql(1123.13);
    });

    it('returns NaN for invalid number', () => {
      expect(sanitizers.toFloat('aaa')).to.be.NaN;
    });
  });

  describe('.toDate', () => {
    ['1995-12-17T03:24:00', 'December 17, 1995 03:24:00'].forEach((value) => {
      it(`returns date when passed string ${value}`, () => {
        expect(sanitizers.toDate('December 17, 1995 03:24:00')).to.be.instanceOf(Date);
      });
    });

    it('returns date when passed int', () => {
      expect(sanitizers.toDate(1590021485700)).to.be.instanceof(Date);
    });
  });

  describe('.trim', () => {
    it('trims a string of whitespace', () => {
      expect(sanitizers.trim('  \r\n\n\thello!\nYup!  ')).to.eql('hello!\nYup!');
    });

    it('trims a string of custom chars', () => {
      expect(sanitizers.trim('(hello)', {chars: '()'})).to.eql('hello');
    });
  });

  describe('.toString', () => {
    [[1, '1'], [['aa', 'bb'], 'aa,bb']].forEach(([value, expected]) => {
      it(`it converts ${expected} to string`, () => {
        expect(sanitizers.toString(value)).to.eql(expected);
      });
    });
  });

  describe('.lowerCase', () => {
    [
      ['aaa', 'aaa'],
      ['aBa', 'aba'],
      ['Baa', 'baa'],
      ['aaB', 'aab'],
      ['BBB', 'bbb'],
    ].forEach(([value, expected]) => {
      it(`converts ${value} to ${expected}`, () => {
        expect(sanitizers.lowerCase(value)).to.eql(expected);
      });
    });
  });

  describe('.upperCase', () => {
    [
      ['aaa', 'AAA'],
      ['aBa', 'ABA'],
      ['Baa', 'BAA'],
      ['aaB', 'AAB'],
      ['BBB', 'BBB'],
    ].forEach(([value, expected]) => {
      it(`converts ${value} to ${expected}`, () => {
        expect(sanitizers.upperCase(value)).to.eql(expected);
      });
    });
  });

  describe('.titleCase', () => {
    it('converts to title case', () => {
      expect(sanitizers.titleCase('this Is a test for titleCase')).to.eql('This is a Test for titleCase');
    });
  });

  describe('.upperCaseFirst', () => {
    it('uppercases first letter', () => {
      expect(sanitizers.upperCaseFirst('test')).to.eql('Test');
    });
  });

  describe('.toBool', () => {
    [
      [true, true, 'true'],
      [false, false, 'false'],
      ['true', true, "'true'"],
      ['false', false, "'false'"],
      [1, true, '1'],
      ['1', true, "'1'"],
      [0, false, '0'],
      [2, false, '2'],
      ['test', false, "'test'"],
    ].forEach(([value, expected, label]) => {
      it(`converts ${label} to boolean`, () => {
        expect(sanitizers.toBool(value)).to.eql(expected);
      });
    });
  });
});
