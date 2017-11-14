import { parseBinString } from './big-int-impl/parse-bin-string';


/**
 * Big Integer with arbitrary precision
 *
 * In this implementation, the value of number is stored as array of JavaScript numbers internally
 */
export class BigInt {
  constructor(value, radix = 10) {
    this.positive = true;
    this.arr = [0];

    if (value === undefined) return;
    if (typeof value === 'string') { this.parseString(value, radix); return; }
    if (typeof value === 'number') { this.setNumber(value); return; }
    if (typeof value === 'object' && value instanceof Uint8Array) { this.setBuffer(value); }
  }

  /**
   * parse the value for a string representation
   *
   * @param {string} str string representation of integer
   * @param {number} radix radix used in string, supporting 2 to 36
   */
  parseString(str, radix = 10) {
    const s = str.replace(/\s|_|,/g, '').toLowerCase();
    const binArr = parseBinString(s[0] === '-' ? s.slice(1) : s, radix);
    if (binArr) {
      this.arr = binArr;
      if (s[0] === '-') this.positive = false;
      return this;
    }
    this.arr = [0];
    return this;
  }

  toString(radix = 10) {
    if (radix === 2) return this.arr.map(i => ('0'.repeat(16) + i.toString(2)).slice(-16)).reverse().join('').replace(/^0*/, '');
    if (radix === 4) return this.arr.map(i => ('0'.repeat(8) + i.toString(4)).slice(-8)).reverse().join('').replace(/^0*/, '');
    if (radix === 16) return this.arr.map(i => ('0'.repeat(4) + i.toString(16)).slice(-4)).reverse().join('').replace(/^0*/, '');
    return '';
  }
}

export default BigInt;
