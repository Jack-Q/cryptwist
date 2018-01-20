import {
  MD4HashBase,
} from './md4-family/base';


// use little endian format for numerical value representation
const initState = Uint32Array.of(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0);

const yTable = Uint32Array.of(0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6);

/**
 *
 * @param {Uint32Array} state
 * @param {Uint8Array} buffer
 */
const sha1MainLoop = (state, buffer) => {
  let [a, b, c, d, e] = state;

  // for buffer expansion
  const internalBuffer = new Uint32Array(16);

  for (let i = 0; i < 80; i += 1) {
    let f = 0;
    let y = 0;

    if (i < 20) {
      f = (b & c) | (~b & d);
      y = yTable[0];
    } else if (i < 40) {
      f = b ^ c ^ d;
      y = yTable[1];
    } else if (i < 60) {
      f = (b & c) | (b & d) | (c & d);
      y = yTable[2];
    } else {
      f = b ^ c ^ d;
      y = yTable[3];
    }

    // message buffer and expansion
    const j = i & 0xf;
    if (i < 16) {
      // SHA-1 is conforming big-endian pattern
      internalBuffer[i] =
        (buffer[i * 4 + 0] << 24) |
        (buffer[i * 4 + 1] << 16) |
        (buffer[i * 4 + 2] << 8) |
        (buffer[i * 4 + 3] << 0);
    } else {
      internalBuffer[j] =
        internalBuffer[(j + 13) & 0xf] ^
        internalBuffer[(j + 8) & 0xf] ^
        internalBuffer[(j + 2) & 0xf] ^
        internalBuffer[(j + 0) & 0xf];
      internalBuffer[j] =
        (internalBuffer[j] << 1) | (internalBuffer[j] >>> (32 - 1));
    }

    // const t = ((a << 5) | (a >>> (32 - 5))) +
    //   f + e + internalBuffer[i] + y;
    const t = e + f + internalBuffer[j] + y
      + ((a << 5) | (a >>> (32 - 5)));

    e = d;
    d = c;
    c = (b << 30) | (b >>> (32 - 30));
    b = a;
    a = t;
  }

  state[0] += a;
  state[1] += b;
  state[2] += c;
  state[3] += d;
  state[4] += e;
};


export class SHA1Hash extends MD4HashBase {
  static title = 'sha-1';

  constructor() {
    super(SHA1Hash, 'SHA-1', 'BE');
  }

  mainLoop() {
    sha1MainLoop(this.state, this.buffer);
  }

  initState() {
    this.state = new Uint32Array(5);
  }

  resetState() {
    initState.forEach((v, i) => {
      this.state[i] = v;
    });
  }

  exportState() {
    // export state as big-endian format
    return Uint8Array.from(Array.from(this.state).map(i => [
      (i >>> 24) & 0xff,
      (i >>> 16) & 0xff,
      (i >>> 8) & 0xff,
      (i >>> 0) & 0xff,
    ]).reduce((a, b) => a.concat(b)));
  }

  static hash(data) {
    return new SHA1Hash().hash(data);
  }
}

export default SHA1Hash;
