
const transpose = (arr) => {
  const result = Uint8Array.from(arr);
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      result[i * 4 + j] = arr[j * 4 + i];
    }
  }
  return result;
};

export const initState = (data) => {
  const buffer = transpose(data).buffer;
  return { u8: new Uint8Array(buffer), u32: new Uint32Array(buffer) };
};

export const exportState = state => transpose(state.u8);

export default { initState, exportState };
