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

import { initState, exportState } from './rijndael/state';

import { expandKey } from './rijndael/expand-key';

import { subBytes } from './rijndael/sub-bytes';
import { shiftRows } from './rijndael/shift-rows';
import { mixColumns } from './rijndael/mix-columns';

const checkKey = (key) => {

};


const addRoundKey = (state, key, index) => {
  for (let i = 0; i < 4; i += 1) {
    state.u8[0 * 4 + i] ^= ((key[index * 4 + i] >>> 0) & 0xff);
    state.u8[1 * 4 + i] ^= ((key[index * 4 + i] >>> 8) & 0xff);
    state.u8[2 * 4 + i] ^= ((key[index * 4 + i] >>> 16) & 0xff);
    state.u8[3 * 4 + i] ^= ((key[index * 4 + i] >>> 24) & 0xff);
  }
};


const aesCore = (data, subKey) => {
  const nR = subKey.length / 4 - 1;
  // state is a byte buffer with uint32/uint8 view
  const state = initState(data);

  addRoundKey(state, subKey, 0);
  for (let i = 1; i < nR; i += 1) {
    subBytes(state);
    shiftRows(state);
    mixColumns(state);
    addRoundKey(state, subKey, i);
  }
  subBytes(state);
  shiftRows(state);
  addRoundKey(state, subKey, nR);

  const result = exportState(state);
  return result;
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
    return aesCore(data, this.subKey);
  }

  decrypt(cipher) {
    if (cipher.length !== 16) {
      throw 'AES-128 requires the length of cipher for encryption is 128 bits (16 bytes)';
    }
    return aesCore(cipher, this.subKey.map(i => i).reverse());
  }
}

export default AES128BlockCipher;
