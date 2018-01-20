/**
 * Advanced Encryption Standard (Rijndael Algorithm)
 *  => with 256 bits key (AES-256)
 *
 * General Information
 * ===================
 *
 * Key Specification
 * =================
 * length: 32 bytes 256 bit
 */

import { BlockCipher, BlockCipherMeta } from '../base/api';

import { encrypt, decrypt, expandKey } from './rijndael/core';

export class AES256BlockCipher extends BlockCipher {
  static meta = new BlockCipherMeta('aes-256', 32, 16);
  static title = AES256BlockCipher.meta.title;

  constructor(key) {
    super(key);

    // check AES key
    if (key.length !== 32) {
      throw 'AES-256 requires the length of key to be 256 bits (32 bytes)';
    }

    // generate AES sub-keys
    this.subKey = expandKey(this.key);
  }

  encrypt(data) {
    if (data.length !== 16) {
      throw 'AES-256 requires the length of data block for encryption is 256 bits (48 bytes)';
    }
    return encrypt(data, this.subKey);
  }

  decrypt(cipher) {
    if (cipher.length !== 16) {
      throw 'AES-256 requires the length of cipher for encryption is 256 bits (48 bytes)';
    }
    return decrypt(cipher, this.subKey);
  }
}

export default AES256BlockCipher;
