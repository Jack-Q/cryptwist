import { MD4HashBase, exportUint8ArrayBE } from './md4-family/base';
import { sha2MainLoop } from './md4-family/sha-256-cal';

// use little endian format for numerical value representation
const initState = Uint32Array.of(
  0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
  0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4,
);

export class SHA224Hash extends MD4HashBase {

  static title = 'sha-224';

  constructor() {
    super(SHA224Hash, 'SHA-224', 'BE');
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
    return exportUint8ArrayBE(this.state.slice(0, 7));
  }

  static hash(data) {
    return new SHA224Hash().hash(data);
  }
}

export default SHA224Hash;

