import { initState, exportState } from './state';


import { subBytes, invSubBytes } from './sub-bytes';
import { shiftRows, invShiftRows } from './shift-rows';
import { mixColumns, invMixColumns } from './mix-columns';
import { expandKey } from './expand-key';

export { expandKey } from './expand-key';

const addRoundKey = (state, key, index) => {
  for (let i = 0; i < 4; i += 1) {
    state.u8[0 * 4 + i] ^= ((key[index * 4 + i] >>> 0) & 0xff);
    state.u8[1 * 4 + i] ^= ((key[index * 4 + i] >>> 8) & 0xff);
    state.u8[2 * 4 + i] ^= ((key[index * 4 + i] >>> 16) & 0xff);
    state.u8[3 * 4 + i] ^= ((key[index * 4 + i] >>> 24) & 0xff);
  }
};


export const encrypt = (data, subKey) => {
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

export const decrypt = (cipher, subKey) => {
  const nR = subKey.length / 4 - 1;
  // state is a byte buffer with uint32/uint8 view
  const state = initState(cipher);

  addRoundKey(state, subKey, nR);
  for (let i = nR - 1; i > 0; i -= 1) {
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, subKey, i);
    invMixColumns(state);
  }
  invShiftRows(state);
  invSubBytes(state);
  addRoundKey(state, subKey, 0);

  const result = exportState(state);
  return result;
};


export default {
  expandKey, encrypt, decrypt,
};
