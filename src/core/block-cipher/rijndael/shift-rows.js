/**
 *
 * @param {{u32: Uint32Array}} state
 */
export const shiftRows = (state) => {
  const u32 = state.u32;
  u32[1] = (u32[1] << 8) | (u32[1] >>> (32 - 8));
  u32[2] = (u32[2] << 16) | (u32[2] >>> (32 - 16));
  u32[3] = (u32[3] << 24) | (u32[3] >>> (32 - 24));
  return state;
};

export default shiftRows;
