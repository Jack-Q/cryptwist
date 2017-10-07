import { assign, retrieve, index, rotL } from './util';

export const theta = (state) => {
  const c = new Uint32Array(5 * 2);
  const cs = new Uint32Array(5 * 2);
  // update parity of echo column
  for (let i = 0; i < 5; i += 1) {
    const c0 = retrieve(state, index(i, 0));
    const c1 = retrieve(state, index(i, 1));
    const c2 = retrieve(state, index(i, 2));
    const c3 = retrieve(state, index(i, 3));
    const c4 = retrieve(state, index(i, 4));
    const ci = [
      c0[0] ^ c1[0] ^ c2[0] ^ c3[0] ^ c4[0],
      c0[1] ^ c1[1] ^ c2[1] ^ c3[1] ^ c4[1],
    ];
    const csi = rotL(...ci, 1);
    assign(c, i, ...ci);
    assign(cs, i, ...csi);
  }

  // update the state
  for (let x = 0; x < 5; x += 1) {
    const d1 = retrieve(c, (x + 4) % 5);
    const d2 = retrieve(cs, (x + 1) % 5);
    const d = [d1[0] ^ d2[0], d1[1] ^ d2[1]];
    for (let y = 0; y < 5; y += 1) {
      const l = retrieve(state, index(x, y));
      assign(state, index(x, y), ...[
        l[0] ^ d[0],
        l[1] ^ d[1],
      ]);
    }
  }

  return state;
};
export default theta;
