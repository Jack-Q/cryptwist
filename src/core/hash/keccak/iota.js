import { assign, retrieve, index } from './util';

const rc = (t0) => {
  const t = t0 % 255;
  if (t === 0) return 1;
  let r = 0b10000000;
  for (let i = 0; i < t; i += 1) {
    if (r & 0b1) {
      r = (r >>> 1) ^ 0b10001110;
    } else {
      r >>>= 1;
    }
  }
  return r >>> 7;
};

const bits = [
  [1 << 0, 0],
  [1 << 1, 0],
  [1 << 3, 0],
  [1 << 7, 0],
  [1 << 15, 0],
  [1 << 31, 0],
  [0, 1 << 31],
];

export const iota = (state, round) => {
  const l = retrieve(state, index(0, 0));
  const RC = [0, 0];
  for (let i = 0; i <= 6; i += 1) {
    if (rc(i + 7 * round)) {
      RC[0] ^= bits[i][0];
      RC[1] ^= bits[i][1];
    }
  }

  assign(state, index(0, 0), ...[
    l[0] ^ RC[0],
    l[1] ^ RC[1],
  ]);
  return state;
};

export default iota;
