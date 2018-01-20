export class Int64 {
  constructor(number = 0) {
    this.data = Uint32Array.of(0, 0, 0);
    this.addNumberToLength(number);
  }

  /**
   * Use 3 32-bit number to simulate 64-bit number
   * @param {Array<Number>} len length array to update
   * @param {Number|Array<Number>} cur
   */
  addNumberToLength(cur) {
    const arr = cur instanceof Int64 ? cur.data : [0, cur >>> 24, cur & 0xffffff];
    let carry = 0;

    this.data[2] += arr[2];
    carry = this.data[2] >>> 24;
    this.data[2] &= 0xffffff;

    this.data[1] += arr[1] + carry;
    carry = this.data[1] >>> 24;
    this.data[1] &= 0xffffff;

    this.data[0] += arr[0] + carry;
    carry = this.data[1] >>> 24;
    this.data[0] &= 0xffff;

    return carry;
  }

  get loBytesLE() {
    return Uint8Array.of(
      this.data[2],
      this.data[2] >>> 8,
      this.data[2] >>> 16,
      this.data[1],
    );
  }

  get hiBytesLE() {
    return Uint8Array.of(
      this.data[1] >>> 8,
      this.data[1] >>> 16,
      this.data[0],
      this.data[0] >>> 8,
    );
  }

  get bytesLE() {
    return Uint8Array.of(...this.loBytesLE, ...this.hiBytesLE);
  }

  get hiBytesBE() {
    return Uint8Array.of(
      this.data[0] >>> 8,
      this.data[0],
      this.data[1] >>> 16,
      this.data[1] >>> 8,
    );
  }

  get loBytesBE() {
    return Uint8Array.of(
      this.data[1],
      this.data[2] >>> 16,
      this.data[2] >>> 8,
      this.data[2],
    );
  }

  get bytesBE() {
    return Uint8Array.of(...this.hiBytesBE, ...this.loBytesBE);
  }

  get val() {
    return (this.data[0] & 0xffffff) * (2 ** 48) +
      (this.data[1] & 0xffffff) * (2 ** 24) +
      (this.data[2] & 0xffffff) * (2 ** 0);
  }

  set val(val) {
    this.data.fill(0);
    this.addNumberToLength(val);
  }
}

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

export default { Int64, Int128 };
