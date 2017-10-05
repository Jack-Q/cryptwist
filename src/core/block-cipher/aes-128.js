/**
 * Advanced Encryption Standard (Rijndael Algorithm)
 *  => with 128 bits key (AES-128)
 *
 * General Information
 * ===================
 *
 * Key Specification
 * =================
 * length: 16 bytes 128 bit
 */

import { BlockCipher } from '../base/api';

import { encrypt, decrypt, expandKey } from './rijndael/core';

const checkKey = (key) => {

};


export class AES128BlockCipher extends BlockCipher {

  constructor(key) {
    super(key);

    // check AES key
    checkKey(key);

    // generate AES sub-keys
    this.subKey = expandKey(this.key);
  }

  encrypt(data) {
    if (data.length !== 16) {
      throw 'AES-128 requires the length of data block for encryption is 128 bits (16 bytes)';
    }
    return encrypt(data, this.subKey);
  }

  decrypt(cipher) {
    if (cipher.length !== 16) {
      throw 'AES-128 requires the length of cipher for encryption is 128 bits (16 bytes)';
    }
    return decrypt(cipher, this.subKey);
  }
}

export default AES128BlockCipher;
