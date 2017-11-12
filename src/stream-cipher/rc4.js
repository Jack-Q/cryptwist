/*
 * RC4 Stream Cipher (Rivest Cipher 4, or ARC4 for Alleged Rivest Cipher 4)
 *
 * General Information
 * ===================
 * - Designed by Ron Rivest
 * - Broadly for encryption of stream based data, such as network traffic
 * - Owing to some issues in application, this cipher is not generally
 *   not recommended to be used in new protocol other then for historic
 *   reasons. The prohibition is also documented as RFC7465, with detailed
 *   reasons as explanation.
 * - Used in WEP(for an deprecated option of Wi-Fi encryption),
 *   SSL(as an deprecated option of data encryption cipher suite)
 *
 * Key Specification
 * =================
 * length: typical     5 -  16 bytes （40 -  256 bits)
 *         acceptable  1 - 256 bytes  ( 8 - 2048 bits)
 * format: no explicit constraints
 */

import { StreamCipher } from '../base/api';

/**
 * Helper function to swap element in an array
 *
 * @param {Uint8Array} array
 * @param {Number} p
 * @param {Number} q
 */
const swap = (array, p, q) => {
  array[q] ^= array[p]; // eslint-disable-line
  array[p] ^= array[q]; // eslint-disable-line
  array[q] ^= array[p]; // eslint-disable-line
  return array;
};

const CIPHER_NAME = 'RC4';
const MIN_KEY_LEN = 1;
const MAX_KEY_LEN = 256;
const STATE_SIZE = 256;

/**
 * Key scheduling algorithm for RC4
 *
 * This is used to initialize the permutation of state array ``S''
 *
 * @param {Uint8Array} key Key for RC4
 * @returns {Uint8Array}
 */
export const ksa = (key) => {
  const keyLength = key.length;

  if (keyLength < MIN_KEY_LEN || keyLength > MAX_KEY_LEN) {
    throw `inappropriate length of key for ${CIPHER_NAME}, expecting unsigned byte array (Uint8Array) with ${MIN_KEY_LEN} to ${MAX_KEY_LEN} elements`;
  }

  // initialize state array to [0..255]
  const stateArray = new Uint8Array(STATE_SIZE).fill(0).map((v, i) => i);

  // permute state array using the key
  for (let i = 0, j = 0; i < STATE_SIZE; i += 1) {
    j = (j + stateArray[i] + key[i % keyLength]) % STATE_SIZE;
    swap(stateArray, i, j);
  }
  return stateArray;
};

/**
 * Pseudo-Random Generation Algorithm
 *
 * @param {Uint8Array} stateArray
 */
export function prga(stateArray) {
  let i = 0;
  let j = 0;

  return {
    next: () => {
      i = (i + 1) % STATE_SIZE;
      j = (j + stateArray[i]) % STATE_SIZE;
      swap(stateArray, i, j);

      const t = (stateArray[i] + stateArray[j]) % STATE_SIZE;

      return { value: stateArray[t] };
    },
  };
}

export class RC4StreamCipher extends StreamCipher {
  static title = CIPHER_NAME;

  get stream() {
    return prga(ksa(this.key));
  }

  encrypt(data) {
    const stream = this.stream;
    return data.map(v => v ^ stream.next().value);
  }

  decrypt(cipher) {
    return this.encrypt(cipher);
  }
}

export default RC4StreamCipher;
