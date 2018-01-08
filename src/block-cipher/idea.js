/**
 * IDEA Block Cipher
 *
 * General Information
 * ===================
 *
 * Key Specification
 * =================
 * length: 16 bytes, 128 bit
 *
 * Message Block
 * =============
 * plain: 8 bytes, 64 bits
 * cipher: 8 bytes, 64 bits
 */

import { BlockCipher } from '../base/api';

// primitive operators
const mul = (a, b) => ((a & 0xffff) || 0x10000) * ((b & 0xffff) || 0x10000) % 0x10001;
const add = (a, b) => (a + b) & 0xffff;
const inv = (a) => {
  if (a === 0) return 0;
  let t0 = 0;
  let t1 = 1;
  let r0 = 0x10001;
  let r1 = a;
  while (r1 !== 0) {
    const r = r0 % r1;
    const q = (r0 - r) / r1;
    [t0, t1] = [t1, t0 - q * t1];
    [r0, r1] = [r1, r];
  }
  return t0 < 0 ? t0 + 0x10001 : t0;
};

const addKey = (msg, key) => {
  msg[0] = mul(msg[0], key[0]);
  msg[1] = mul(msg[1], key[1]);
  msg[2] = add(msg[2], key[2]);
  msg[3] = add(msg[3], key[3]);
};

const generateSubKey = (key) => {
  let pos = 0;
  let arr = Uint16Array.of(
    (key[0] << 8) | key[1],
    (key[2] << 8) | key[3],
    (key[4] << 8) | key[5],
    (key[6] << 8) | key[7],
    (key[8] << 8) | key[9],
    (key[10] << 8) | key[11],
    (key[12] << 8) | key[13],
    (key[14] << 8) | key[15],
  );
  const shift = ([a, b, c, d, e, f, g, h]) => {
    arr = Uint16Array.of(
      (b << 9) | (c >>> 7),
      (c << 9) | (d >>> 7),
      (d << 9) | (e >>> 7),
      (e << 9) | (f >>> 7),
      (f << 9) | (g >>> 7),
      (g << 9) | (h >>> 7),
      (h << 9) | (a >>> 7),
      (a << 9) | (b >>> 7),
    );
    pos = 0;
    return arr;
  };
  const next = () => (pos === 8 ? shift(arr) : arr)[pos++];
  return Array(9).fill(0).map((_, i) => new Uint16Array(i === 8 ? 4 : 6).map(next));
};
const generateDecSubKey = subKey => Array(9).fill(0).map((_, i) => Uint16Array.of(
  inv(subKey[8 - i][0]),
  inv(subKey[8 - i][1]),
  0x10000 - subKey[8 - i][2],
  0x10000 - subKey[8 - i][3],
  ...(i === 8 ? [] : [subKey[7 - i][4], subKey[7 - i][5]]),
));
const ideaCore = (msg, key) => {
  const inMsg = Uint16Array.of(
    (msg[0] << 8) | msg[1],
    (msg[2] << 8) | msg[3],
    (msg[4] << 8) | msg[5],
    (msg[6] << 8) | msg[7],
  );
  for (let i = 0; i < 8; i++) {
    addKey(inMsg, key[i]);
    let tmp = mul(inMsg[0] ^ inMsg[2], key[i][4]);
    const r1 = mul(add(inMsg[1] ^ inMsg[3], tmp), key[i][5]);
    const r0 = add(tmp, r1);

    tmp = inMsg[0];
    inMsg[0] = inMsg[2] ^ r1;
    inMsg[2] = tmp ^ r1;
    tmp = inMsg[1];
    inMsg[1] = inMsg[3] ^ r0;
    inMsg[3] = tmp ^ r0;
  }
  addKey(inMsg, key[8]);
  return Uint8Array.of(
    inMsg[0] >>> 8, inMsg[0],
    inMsg[1] >>> 8, inMsg[1],
    inMsg[2] >>> 8, inMsg[2],
    inMsg[3] >>> 8, inMsg[3],
  );
};

export class IDEABlockCipher extends BlockCipher {

  static meta = new IDEABlockCipher('idea-128', 8, 8);
  static title = IDEABlockCipher.meta.title;

  constructor(key) {
    super(key);

    // generate IDEA sub-keys
    this.subKey = generateSubKey(this.key);
    this.decSubKey = generateDecSubKey(this.subKey);
  }

  encrypt(data) {
    if (data.length !== 8) {
      throw 'IDEA requires the length of data block for encryption is 64 bits (8 bytes)';
    }
    return ideaCore(data, this.subKey);
  }

  decrypt(cipher) {
    if (cipher.length !== 8) {
      throw 'IDEA requires the length of cipher for decryption is 64 bits (8 bytes)';
    }
    return ideaCore(cipher, this.decSubKey);
  }
}

export default IDEABlockCipher;
