import { assign, retrieve, index } from './util';

export const chi = (state) => {
  for (let y = 0; y < 5; y += 1) {
    const t0 = retrieve(state, index(0, y));
    const t1 = retrieve(state, index(1, y));
    const t2 = retrieve(state, index(2, y));
    const t3 = retrieve(state, index(3, y));
    const t4 = retrieve(state, index(4, y));

    const x0 = [t0[0] ^ (~t1[0] & t2[0]), t0[1] ^ (~t1[1] & t2[1])];
    const x1 = [t1[0] ^ (~t2[0] & t3[0]), t1[1] ^ (~t2[1] & t3[1])];
    const x2 = [t2[0] ^ (~t3[0] & t4[0]), t2[1] ^ (~t3[1] & t4[1])];
    const x3 = [t3[0] ^ (~t4[0] & t0[0]), t3[1] ^ (~t4[1] & t0[1])];
    const x4 = [t4[0] ^ (~t0[0] & t1[0]), t4[1] ^ (~t0[1] & t1[1])];

    assign(state, index(0, y), ...x0);
    assign(state, index(1, y), ...x1);
    assign(state, index(2, y), ...x2);
    assign(state, index(3, y), ...x3);
    assign(state, index(4, y), ...x4);
  }
  return state;
};


export default chi;
