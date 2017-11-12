import { BlockCipher } from '../base/api';

import { DESBlockCipher } from './des';


export const checkKey = (key) => {
  if (key instanceof Array) {
    if (key.length === 2) {
      return [Uint8Array.from(key[0]), Uint8Array.from(key[1]), Uint8Array.from(key[0])];
    }
    if (key.length === 3) {
      return key.map(k => Uint8Array.from(k));
    }
    throw 'key or keys should in Uint8Array format or array of Uint8Array with 2 or 3 elements';
  } else if (key instanceof Uint8Array) {
    if (key.length === 64 || key.length === 56) {
      console.warn('using 1 key for Triple-DES is the same as DES while the latter is more efficient');
      return Array(3).fill(0).map(_ => Uint8Array.from(key));
    }
    if (key.length === 128 || key.length === 112) {
      return key.length === 128 ?
        [key.slice(0, 63), key.slice(64, 127), key.slice(0, 63)] :
        [key.slice(0, 55), key.slice(56, 111), key.slice(0, 55)];
    }
    if (key.length === 192 || key.length === 168) {
      return key.length === 192 ?
      [key.slice(0, 63), key.slice(64, 127), key.slice(128, 191)] :
      [key.slice(0, 55), key.slice(56, 111), key.slice(112, 167)];
    }
    throw 'the length of key for Triple-DES should be 128 or 192 (112 or 168 w/o parity bits) bits';
  }
  throw 'key should be UintArray';
};

export class TripleDESBlockCipher extends BlockCipher {

  constructor(key) {
    super(key);
    this.keys = checkKey(key);
    this.tripleCipher = this.keys.map(k => new DESBlockCipher(k));
  }

  encrypt(data) {
    return this.tripleCipher.reduce((m, c, i) =>
      (i === 1 ? c.decrypt(m) : c.encrypt(m)), data);
  }

  decrypt(cipher) {
    return this.tripleCipher.reduceRight((m, c, i) =>
      (i === 1 ? c.encrypt(m) : c.decrypt(m)), cipher);
  }
}

export default TripleDESBlockCipher;
