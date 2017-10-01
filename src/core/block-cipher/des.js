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

import { generateSubKey } from './des-impl/sub-key';
import { initialPermute, finalPermute } from './des-impl/perm';
import { desFunc } from './des-impl/des-func';
import { feistelStructure } from './des-impl/festial';
import { checkKey } from './des-impl/check-key';

const desCore = (data, subKey) => {
  const permutedData = initialPermute([data.slice(0, 4), data.slice(4)]);

  const encryptedData = feistelStructure(desFunc, subKey, permutedData);

  const result = finalPermute(encryptedData);
  return Uint8Array.of(...result[0], ...result[1]);
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
    return desCore(data, this.subKey);
  }

  decrypt(cipher) {
    if (cipher.length !== 8) {
      throw 'DES requires the length of cipher for encryption is 64 bits (8 bytes)';
    }
    return desCore(cipher, this.subKey.map(i => i).reverse());
  }
}

export default DESBlockCipher;
