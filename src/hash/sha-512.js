import { MD4HashBase, exportUint8ArrayBE } from './md4-family/base';
import { sha2MainLoop } from './md4-family/sha-512-cal';

// use little endian format for numerical value representation
const initState = Uint32Array.of(
  0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b,
  0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
  0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
  0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179,
);

export class SHA512Hash extends MD4HashBase {

  constructor() {
    super(SHA512Hash, 'SHA-512', 'BE', true);
  }

  mainLoop() {
    sha2MainLoop(this.state, this.buffer);
  }

  initState() {
    this.state = new Uint32Array(16);
  }

  resetState() {
    initState.forEach((v, i) => {
      this.state[i] = v;
    });
  }

  exportState() {
    return exportUint8ArrayBE(this.state);
  }

  static hash(data) {
    return new SHA512Hash().hash(data);
  }
}

export default SHA512Hash;
