import { Int64 } from './int-64';

export class Int128 {
  constructor(number = 0) {
    this.hi = new Int64();
    this.lo = new Int64();
    this.addNumberToLength(number);
  }
  addNumberToLength(number) {
    if (typeof number === 'number') {
      const lo = number % 0xffffffff;
      const hi = Math.floor((number - lo) / 0xffffffff);
      const carry = this.lo.addNumberToLength(lo);
      return this.hi.addNumberToLength(hi) + this.hi.addNumberToLength(carry);
    } else if (number instanceof Int128) {
      const carry = this.lo.addNumberToLength(number.lo);
      return this.hi.addNumberToLength(number.hi) + this.hi.addNumberToLength(carry);
    } else if (number instanceof Int64) {
      const carry = this.lo.addNumberToLength(number);
      return this.hi.addNumberToLength(carry);
    }
    console.log('unknown typeof number');
    return 0;
  }

  get bytesBE() {
    return Uint8Array.of(...this.hi.bytesBE, ...this.lo.bytesBE);
  }

  get bytesLE() {
    return Uint8Array.of(...this.lo.bytesLE, ...this.hi.bytesLE);
  }

  get val() {
    return this.hi.val * (2 ** 64) + this.lo.val;
  }
  set val(val) {
    const lo = val % 0xffffffff;
    const hi = Math.floor((val - lo) / 0xffffffff);
    this.hi.val = hi;
    this.lo.val = lo;
  }
}

export default Int128;
