/**
 * Data Encryption Standard
 *
 * General Information
 * ===================
 *
 * Key Specification
 * =================
 * length: 8 bytes 64 bit, with parity check
 */

import { BlockCipher } from '../base/api';

import generateSubKey from './des-impl/sub-key';
import { initialPermute, finalPermute } from './des-impl/perm';

const checkParity = (b8) => {
  const b4 = b8 ^ (b8 >>> 4);
  const b2 = b4 ^ (b4 >>> 2);
  const b1 = b2 ^ (b2 >>> 1);
  return (b1 & 0b1) === 1;
};

/**
 * validate key
 * @param {Uint8Array} key Key for DES method
 * @returns {{checked: boolean, original: Uint8Array, core: Uint8Array}} validity of the key
 */
export const checkKey = (key) => {
  if (key.length !== 8) {
    if (key.length === 7) {
      console.warn('56 bits DES key received, no parity check performed');
      return { checked: false, original: key, core: key };
    }
    throw 'DES key is required to be 64 bits (8 bytes)';
  }

  // check bits parity
  if (!key.every(checkParity)) {
    throw 'Parity check failed for DES key';
  }

  const keyCore = new Uint8Array(7).fill(0)
    .map((_, i) => ((key[i] & 0xfe) << i) | (key[i + 1] >>> (7 - i)));

  return { checked: true, original: key, core: keyCore };
};

const feistelStructure = (f, subKey, data, round = subKey.length) => {
  let result = data;
  for (let i = 0; i < round; i += 1) {
    result = [result[1], f(result[0], subKey[1])];
  }
  return result;
};

export class DESBlockCipher extends BlockCipher {

  constructor(key) {
    super(key);

    // check DES key
    const checkResult = checkKey(key);
    this.keyChecked = checkResult.checked;
    this.keyCore = checkResult.core;

    // generate DES sub-keys
    this.subKey = generateSubKey(this.keyCore);
  }

  encrypt(data) {
    if (data.length !== 8) {
      throw 'DES requires the length of data block for encryption is 64 bits (8 bytes)';
    }
    const permutedData = initialPermute([data.slice(0, 4), data.slice(4)]);

    const encrpytedData = feistelStructure(desFunc, this.subKey, permutedData);

    const result = finalPermute(encryptedData);
    return Int8Array.of(...result[0], ...result[1]);
  }

  decrypt(cipher) {

  }
}

export default DESBlockCipher;
