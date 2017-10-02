import {
  Hash,
} from '../base/api';

const initState = Uint32Array.of(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);
// const initState = Uint32Array.of(0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210);

// Generate constant table can use the following statement
// const k = Array(64).fill(0).map((_, i) =>
//   Math.floor(Math.abs(Math.sin(i + 1)) * (2 ** 32)) & 0xffffffff);
// and the result will be shown as follows:
const k = Uint32Array.of(
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
  0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
  0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
  0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
  0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
  0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
  0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
  0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
  0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
);

const shiftAmount = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];


/**
 *
 * @param {Uint32Array} state
 * @param {Uint8Array} buffer
 */
const md5MainLoop = (state, buffer) => {
  let [a, b, c, d] = state;

  for (let i = 0; i < 64; i += 1) {
    let f = 0;
    let g = 0;

    if (i < 16) {
      f = (b & c) | (~b & d);
      g = i;
    } else if (i < 32) {
      f = (d & b) | (~d & c);
      g = (5 * i + 1) % 16;
    } else if (i < 48) {
      f = b ^ c ^ d;
      g = (3 * i + 5) % 16;
    } else {
      f = c ^ (b | ~d);
      g = (7 * i) % 16;
    }
    const mg =
      (buffer[g * 4 + 3] << 24) |
      (buffer[g * 4 + 2] << 16) |
      (buffer[g * 4 + 1] << 8) |
      (buffer[g * 4 + 0] << 0);

    f = f + a + mg + k[i];
    a = d;
    d = c;
    c = b;

    b += (f << shiftAmount[i]) | (f >>> (32 - shiftAmount[i]));
  }

  state[0] += a;
  state[1] += b;
  state[2] += c;
  state[3] += d;
};


/**
 * Use 3 32-bit number to simulate 64-bit number
 * @param {Array<Number>} len length array to update
 * @param {Number|Array<Number>} cur
 */
const addNumberToLength = (len, cur) => {
  const arr = cur instanceof Array ? cur : [0, cur >>> 24, cur & 0xffffff];
  let carry = 0;

  len[2] += arr[2];
  carry = len[2] >>> 24;
  len[2] &= 0xffffff;

  len[1] += arr[1] + carry;
  carry = len[1] >>> 24;
  len[1] &= 0xffffff;

  len[0] += arr[0] + carry;
  len[0] &= 0xffff;
};

const getLoBytesLE = len => Uint8Array.of(
  len[2],
  len[2] >>> 8,
  len[2] >>> 16,
  len[1],
);
const getHiBytesLE = len => Uint8Array.of(
  len[1] >>> 8,
  len[1] >>> 16,
  len[0],
  len[0] >>> 8,
);

const getHiBytesBE = len => Uint8Array.of(
  len[0] >>> 8,
  len[0],
  len[1] >>> 16,
  len[1] >>> 8,
);

const getLoBytesBE = len => Uint8Array.of(
  len[1],
  len[2] >>> 16,
  len[2] >>> 8,
  len[2],
);

export class MD5Hash extends Hash {

  hash(data) {
    if (this.clean) {
      return this.endData(data);
    }
    // use static method to construct new hash
    return MD5Hash.hash(data);
  }

  init() {
    this.state = new Uint32Array(4);
    this.clean = true;
    this.length = [0, 0, 0];
    this.buffer = new Uint8Array(64);
    this.bufferLength = 0;
  }

  reset() {
    initState.forEach((v, i) => { this.state[i] = v; });
    this.clean = true;
    this.length.fill(0);
    this.buffer.fill(0);
    this.bufferLength = 0;
  }

  endData(data) {
    this.feedData(data);

    // finalize padding
    this.buffer[this.bufferLength] = 0b10000000; // add a single '1' bit
    this.buffer.fill(0, this.bufferLength + 1);
    if (this.bufferLength >= 56) {
      // no sufficient space for writing padding length
      this.mainLoop();
      this.buffer.fill(0);
    }
    this.buffer.set(getLoBytesLE(this.length), 56);
    this.buffer.set(getHiBytesLE(this.length), 60);
    this.mainLoop();

    const result = new Uint8Array(Uint32Array.of(...this.state).buffer);
    this.reset();
    return result;
  }

  mainLoop() {
    md5MainLoop(this.state, this.buffer);
  }

  feedData(data) {
    if (data.length === 0) {
      return;
    }

    this.clean = false;
    let pos = 0;
    while (pos < data.length) {
      const len = Math.min(data.length - pos, this.buffer.length - this.bufferLength);
      this.buffer.set(data.slice(pos, pos + len), this.bufferLength);
      this.bufferLength += len;
      pos += len;
      if (this.bufferLength === 64) {
        this.mainLoop();
        this.bufferLength = 0;
      }
    }

    addNumberToLength(this.length, data.length * 8);
  }


  static hash(data) {
    return new MD5Hash().hash(data);
  }
}

export default MD5Hash;
