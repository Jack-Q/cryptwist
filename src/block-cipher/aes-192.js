/**
 * Advanced Encryption Standard (Rijndael Algorithm)
 *  => with 192 bits key (AES-192)
 *
 * General Information
 * ===================
 *
 * Key Specification
 * =================
 * length: 24 bytes 192 bit
 */

import { BlockCipher, BlockCipherMeta } from '../base/api';

import { encrypt, decrypt, expandKey } from './rijndael/core';

export class AES192BlockCipher extends BlockCipher {

  static meta = new BlockCipherMeta('aes-192', 24, 16);
  static title = AES192BlockCipher.meta.title;

  constructor(key) {
    super(key);

    // check AES key
    if (key.length !== 24) {
      throw 'AES-192 requires the length of key to be 192 bits (24 bytes)';
    }

    // generate AES sub-keys
    this.subKey = expandKey(this.key);
  }

  encrypt(data) {
    if (data.length !== 16) {
      throw 'AES-192 requires the length of data block for encryption is 192 bits (48 bytes)';
    }
    return encrypt(data, this.subKey);
  }

  decrypt(cipher) {
    if (cipher.length !== 16) {
      throw 'AES-192 requires the length of cipher for encryption is 192 bits (48 bytes)';
    }
    return decrypt(cipher, this.subKey);
  }
}

export default AES192BlockCipher;
