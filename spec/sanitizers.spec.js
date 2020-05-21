const sanitizers = require('../lib/sanitizers');
const expect = require('chai').expect;

describe('sanitizers', () => {
  describe('.toInt', () => {
    it('converts string to integer', () => {
      expect(sanitizers.toInt('5.5', {})).to.eql(5);
    });

    it('converts integer to integer', () => {
      expect(sanitizers.toInt(5, {})).to.eql(5);
    });

    it('converts float to integer', () => {
      expect(sanitizers.toInt(5.5, {})).to.eql(5);
    });

    it('allows specifying radix', () => {
      expect(sanitizers.toInt('1F', {radix: 16})).to.eql(31);
    });

    it('returns NaN for invalid numbers', () => {
      expect(sanitizers.toInt('aaa', {})).to.be.NaN;
    });
  });

  describe('.toFloat', () => {
    it('converts string to float', () => {
      expect(sanitizers.toFloat('5.23', {})).to.eql(5.23);
    });

    it('converts integer to float', () => {
      expect(sanitizers.toFloat(5, {})).to.eql(5.0);
    });

    it('converts float to float', () => {
      expect(sanitizers.toFloat(5.5, {})).to.eql(5.5);
    });

    it('truncates and rounds down float based on precision', () => {
      expect(sanitizers.toFloat('1234.122', {precision: 1})).to.eql(1234.1);
    });

    it('truncates and rounds up float based on precision', () => {
      expect(sanitizers.toFloat('1123.126456', {precision: 2})).to.eql(1123.13);
    });

    it('returns NaN for invalid number', () => {
      expect(sanitizers.toFloat('aaa', {})).to.be.NaN;
    });
  });

  describe('.toDate', () => {

  });
});
