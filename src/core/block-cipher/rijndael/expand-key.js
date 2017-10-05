import { S_BOX } from './sub-bytes';

// Constant reference table, {{02}^i}{00}{00}{00}
// for (let i = 0, b = 0x01; i < 10; i += 1) {
//   R[i] = b << 24;
//   b = (b << 1) & 0x80 ? (b << 1) ^ 0x11b : b << 1;
// }
const R = [
  0x01000000, 0x02000000, 0x04000000, 0x08000000,
  0x10000000, 0x20000000, 0x40000000, 0x80000000,
  0x1b000000, 0x36000000,
].map(i => i >>> 24);

const subWord = a =>
  (S_BOX[(a >>> 24) & 0xff] << 24) |
  (S_BOX[(a >>> 16) & 0xff] << 16) |
  (S_BOX[(a >>> 8) & 0xff] << 8) |
  (S_BOX[(a >>> 0) & 0xff] << 0);

const rotWord = a => (a >>> 8) | (a << (32 - 8));

export const expandKey = (key) => {
  // may be 4, 6, 8
  const nK = key.length / 4;
  // corresponding to 4, 6, 8
  const nR = [10, 12, 14][nK / 2 - 2];

  const subKeys = new Uint32Array(4 * (nR + 1));


  // copy first nK words from input key as sub-key
  for (let i = 0; i < nK; i += 1) {
    subKeys[i] =
      (key[4 * i + 0] << 0) |
      (key[4 * i + 1] << 8) |
      (key[4 * i + 2] << 16) |
      (key[4 * i + 3] << 24);
  }

  // fill all of the rest keys
  for (let i = nK; i < subKeys.length; i += 1) {
    if (i % nK === 0) {
      subKeys[i] = subKeys[i - nK] ^ subWord(rotWord(subKeys[i - 1])) ^ R[i / nK - 1];
    } else if (nK > 6 && i % nK === 4) {
      subKeys[i] = subKeys[i - nK] ^ subWord(subKeys[i - 1]);
    } else {
      subKeys[i] = subKeys[i - nK] ^ subKeys[i - 1];
    }
  }

  return subKeys;
};

export default expandKey;
