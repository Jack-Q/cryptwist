import { MD4HashBase, exportUint8ArrayBE } from './md4-family/base';
import { sha2MainLoop } from './md4-family/sha-256-cal';

// use little endian format for numerical value representation
const initState = Uint32Array.of(
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
);

export class SHA256Hash extends MD4HashBase {

  static title = 'sha-256';

  constructor() {
    super(SHA256Hash, 'SHA-256', 'BE');
  }

  mainLoop() {
    sha2MainLoop(this.state, this.buffer);
  }

  initState() {
    this.state = new Uint32Array(8);
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
    return new SHA256Hash().hash(data);
  }
}

export default SHA256Hash;
