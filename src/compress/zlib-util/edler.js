const BASE = 65521;

export class Adler32Checksum {
  constructor() {
    this.reset();
  }

  update(buffer, off = 0, len = buffer.length - off) {
    for (let i = 0; i < len; i++) {
      this.s1 = (this.s1 + (buffer[off + i] || 0)) % BASE;
      this.s2 = (this.s2 + this.s1) % BASE;
    }
    return this.adler;
  }

  reset() {
    this.s2 = 0;
    this.s1 = 1;
  }

  get adler() {
    return (this.s2 << 16) | this.s1;
  }

  static getCheck(buffer, off = 0, len = buffer.length - off) {
    return new Adler32Checksum().update(buffer, off, len);
  }
}

export default Adler32Checksum;
