
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

export default checkKey;
