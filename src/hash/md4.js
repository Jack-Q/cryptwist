import { MD4HashBase } from './md4-family/base';

const initState = Uint32Array.of(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);

const indexTable = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15,
  0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15,
];

const shiftAmount = [
  3, 7, 11, 19, 3, 7, 11, 19, 3, 7, 11, 19, 3, 7, 11, 19,
  3, 5, 9, 13, 3, 5, 9, 13, 3, 5, 9, 13, 3, 5, 9, 13,
  3, 9, 11, 15, 3, 9, 11, 15, 3, 9, 11, 15, 3, 9, 11, 15,
];

/**
 *
 * @param {Uint32Array} state
 * @param {Uint8Array} buffer
 */
const md4MainLoop = (state, buffer) => {
  let [a, b, c, d] = state;

  for (let i = 0; i < 48; i += 1) {
    let f = 0;
    let k = 0;

    if (i < 16) {
      f = (b & c) | (~b & d);
      k = 0;
    } else if (i < 32) {
      f = (b & c) | (b & d) | (c & d);
      k = 0x5a827999;
    } else {
      f = b ^ c ^ d;
      k = 0x6ed9eba1;
    }
    const z = indexTable[i];
    const mz =
      (buffer[z * 4 + 3] << 24) |
      (buffer[z * 4 + 2] << 16) |
      (buffer[z * 4 + 1] << 8) |
      (buffer[z * 4 + 0] << 0);

    const t = a + f + mz + k;
    a = d;
    d = c;
    c = b;

    b = (t << shiftAmount[i]) | (t >>> (32 - shiftAmount[i]));
  }

  state[0] += a;
  state[1] += b;
  state[2] += c;
  state[3] += d;
};


export class MD4Hash extends MD4HashBase {

  static title = 'md4';

  constructor() {
    super(MD4Hash, 'MD4');
  }

  mainLoop() {
    md4MainLoop(this.state, this.buffer);
  }

  initState() {
    this.state = new Uint32Array(4);
  }

  resetState() {
    initState.forEach((v, i) => { this.state[i] = v; });
  }

  exportState() {
    return new Uint8Array(Uint32Array.of(...this.state).buffer);
  }

  static hash(data) {
    return new MD4Hash().hash(data);
  }
}

export default MD4Hash;
