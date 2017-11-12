import { MD4HashBase, exportUint8ArrayBE } from './md4-family/base';
import { sha2MainLoop } from './md4-family/sha-512-cal';

// use little endian format for numerical value representation
const initState = Uint32Array.of(
  0xcbbb9d5d, 0xc1059ed8,
  0x629a292a, 0x367cd507,
  0x9159015a, 0x3070dd17,
  0x152fecd8, 0xf70e5939,
  0x67332667, 0xffc00b31,
  0x8eb44a87, 0x68581511,
  0xdb0c2e0d, 0x64f98fa7,
  0x47b5481d, 0xbefa4fa4,
);

export class SHA384Hash extends MD4HashBase {

  static title = 'sha-384';

  constructor() {
    super(SHA384Hash, 'SHA-384', 'BE', true);
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
    return exportUint8ArrayBE(this.state.slice(0, 12));
  }

  static hash(data) {
    return new SHA384Hash().hash(data);
  }
}

export default SHA384Hash;
