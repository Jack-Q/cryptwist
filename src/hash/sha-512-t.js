import { MD4HashBase, exportUint8ArrayBE } from './md4-family/base';
import { sha2MainLoop } from './md4-family/sha-512-cal';

// use little endian format for numerical value representation
const iv0 = Uint32Array.of(
  // the following IV is the same as the one for SHA-512
  0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b,
  0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
  0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
  0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179,
);

export const generateIV = (t) => {
  const iv = iv0.map(i => i ^ 0xa5a5a5a5);
  const buffer = new Uint8Array(128);
  const name = `SHA-512/${t}`.split('').map(i => i.charCodeAt(0));
  buffer.set(name, 0);
  buffer[name.length] = 0x80;
  buffer[127] = name.length * 8;
  sha2MainLoop(iv, buffer);
  return iv;
};

export class SHA512THash extends MD4HashBase {

  static name = 'sha-512/t';

  constructor(t) {
    super(SHA512THash, `SHA-512/${t}`, 'BE', true, t);
  }

  mainLoop() {
    sha2MainLoop(this.state, this.buffer);
  }

  initState(t) {
    if (t === undefined) {
      throw 'SHA-512/t hash function requires a parameter t '
        + 'which indicate the length of the truncated length of the hash value to initiate';
    }
    if (t >= 512 || t <= 0 || t === 384) {
      throw 'the truncated output length of SHA-512/t serial hash function should be '
        + 'a positive integer less than 512 and not to be 384 (use SHA-384)';
    }
    if (t % 8 !== 0) {
      throw 'the truncated output length should be byte aligned';
    }
    this.t = t;
    this.iv = generateIV(t);
    this.state = new Uint32Array(16);
  }

  resetState() {
    this.iv.forEach((v, i) => {
      this.state[i] = v;
    });
  }

  exportState() {
    return exportUint8ArrayBE(this.state).slice(0, this.t / 8);
  }

  static hash(data, t) {
    return new SHA512THash(t).hash(data);
  }
}

export default SHA512THash;
