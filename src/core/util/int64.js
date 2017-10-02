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
    const arr = cur instanceof Array ? cur : [0, cur >>> 24, cur & 0xffffff];
    let carry = 0;

    this.data[2] += arr[2];
    carry = this.data[2] >>> 24;
    this.data[2] &= 0xffffff;

    this.data[1] += arr[1] + carry;
    carry = this.data[1] >>> 24;
    this.data[1] &= 0xffffff;

    this.data[0] += arr[0] + carry;
    this.data[0] &= 0xffff;
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

export default Int64;
