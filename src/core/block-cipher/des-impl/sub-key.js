const permutedChoice1 = Uint8Array.from([
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,

  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4,
]);


const leftRotation = Uint8Array.from([
  1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28,
]);

const permutedChoice2 = Uint8Array.from([
  14, 17, 11, 24, 1, 5,
  3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8,
  16, 7, 27, 20, 13, 2,

  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32,
]);

const permuteKey = (key) => {
  const pk = new Uint8Array(7).fill(0);
  for (let i = 0; i < 56; i += 1) {
    const tableInd = permutedChoice1[i];

    // index in permuted choice 1 is indexed from 1
    // index contains parity bits
    const ind = tableInd - Math.floor(tableInd / 8) - 1;
    const b = (key[Math.floor(ind / 8)] >> (8 - ind % 8)) & 0b1;
    if (b === 0b1) {
      pk[Math.floor(i / 8)] |= 0b1 << (7 - i % 8);
    }
  }
  return pk;
};

const compressPermuteKey = (left, right) => {
  const sk = new Uint8Array(6).fill(0);
  for (let i = 0; i < 48; i += 1) {
    const tableInd = permutedChoice2[i] - 1;
    const bitVal = (tableInd < 28 ? left >>> (27 - tableInd) : right >>> (55 - tableInd)) & 0b1;
    if (bitVal === 0b1) {
      // set bit
      sk[Math.floor(i / 8)] |= 0b1 << (7 - i % 8);
    }
  }
  return sk;
};

/**
 * Generate sub-key for DES
 *
 * @param {Uint8Array} key
 * @returns {Array<Uint8Array>}
 */
const generateSubKey = (key) => {
  const pk = permuteKey(key);
  const leftKey = ((pk[0] << 20) | (pk[1] << 12) | (pk[2] << 4) | (pk[3] >>> 4)) & 0x0fffffff;
  const rightKey = ((pk[3] << 24) | (pk[4] << 16) | (pk[5] << 8) | pk[6]) & 0x0fffffff;

  return Array(16).fill(0).map((_, i) => {
    const left = (leftKey << leftRotation[i]) | (leftKey >>> (28 - leftRotation[i]));
    const right = (rightKey << leftRotation[i]) | (rightKey >>> (28 - leftRotation[i]));
    return compressPermuteKey(left, right);
  });
};

export default generateSubKey;
