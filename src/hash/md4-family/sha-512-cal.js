
const k = Uint32Array.of(
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817,
);


const add = (h1, l1, h2, l2) => {
  const l = (l1 < 0 ? (2 ** 32) + l1 : l1) + (l2 < 0 ? (2 ** 32) + l2 : l2);
  // const l = l1 + l2;
  const c = l > 0xffffffff ? 1 : 0;
  const h = (h1 < 0 ? (2 ** 32) + h1 : h1) + (h2 < 0 ? (2 ** 32) + h2 : h2) + c;

  // cast result to 32 bit
  return [h >>> 0, l >>> 0];
};

const retrieve = (arr, ind) => [arr[ind * 2], arr[ind * 2 + 1]];

const assign = (arr, ind, h, l) => {
  arr[ind * 2] = h;
  arr[ind * 2 + 1] = l;
  return [h, l];
};

const bufSig0 = (h, l) => {
  const r1 = [
    (h >>> 1) | (l << (32 - 1)),
    (l >>> 1) | (h << (32 - 1)),
  ];
  const r8 = [
    (h >>> 8) | (l << (32 - 8)),
    (l >>> 8) | (h << (32 - 8)),
  ];
  const s7 = [
    h >>> 7,
    (l >>> 7) | (h << (32 - 7)),
  ];
  return [
    r1[0] ^ r8[0] ^ s7[0],
    r1[1] ^ r8[1] ^ s7[1],
  ];
};

const bufSig1 = (h, l) => {
  const r19 = [
    (h >>> 19) | (l << (32 - 19)),
    (l >>> 19) | (h << (32 - 19)),
  ];
  const r61 = [
    (l >>> 29) | (h << (32 - 29)),
    (h >>> 29) | (l << (32 - 29)),
  ];
  const s6 = [
    h >>> 6,
    (l >>> 6) | (h << (32 - 6)),
  ];
  return [
    r19[0] ^ r61[0] ^ s6[0],
    r19[1] ^ r61[1] ^ s6[1],
  ];
};

const tmpSig0 = (h, l) => {
  const r28 = [
    (h >>> 28) | (l << (32 - 28)),
    (l >>> 28) | (h << (32 - 28)),
  ];
  const r34 = [
    (l >>> 2) | (h << (32 - 2)),
    (h >>> 2) | (l << (32 - 2)),
  ];
  const r39 = [
    (l >>> 7) | (h << (32 - 7)),
    (h >>> 7) | (l << (32 - 7)),
  ];
  return [
    r28[0] ^ r34[0] ^ r39[0],
    r28[1] ^ r34[1] ^ r39[1],
  ];
};

const tmpSig1 = (h, l) => {
  const r14 = [
    (h >>> 14) | (l << (32 - 14)),
    (l >>> 14) | (h << (32 - 14)),
  ];
  const r18 = [
    (h >>> 18) | (l << (32 - 18)),
    (l >>> 18) | (h << (32 - 18)),
  ];
  const r41 = [
    (l >>> 9) | (h << (32 - 9)),
    (h >>> 9) | (l << (32 - 9)),
  ];
  return [
    r14[0] ^ r18[0] ^ r41[0],
    r14[1] ^ r18[1] ^ r41[1],
  ];
};

/**
 *
 * @param {Uint32Array} state
 * @param {Uint8Array} buffer
 */
export const sha2MainLoop = (state, buffer) => {
  let a = retrieve(state, 0);
  let b = retrieve(state, 1);
  let c = retrieve(state, 2);
  let d = retrieve(state, 3);
  let e = retrieve(state, 4);
  let f = retrieve(state, 5);
  let g = retrieve(state, 6);
  let h = retrieve(state, 7);

  // for buffer expansion
  const internalBuffer = new Uint32Array(32);

  for (let i = 0; i < 80; i += 1) {
    // message buffer and expansion
    const j = i & 0xf;
    if (i < 16) {
      // SHA-2 is conforming big-endian pattern
      assign(internalBuffer, i, ...[
        (buffer[i * 8 + 0] << 24) |
        (buffer[i * 8 + 1] << 16) |
        (buffer[i * 8 + 2] << 8) |
        (buffer[i * 8 + 3] << 0),
        (buffer[i * 8 + 4] << 24) |
        (buffer[i * 8 + 5] << 16) |
        (buffer[i * 8 + 6] << 8) |
        (buffer[i * 8 + 7] << 0),
      ]);
    } else {
      const s1 = bufSig1(...retrieve(internalBuffer, (j + 14) & 0xf));
      const s0 = bufSig0(...retrieve(internalBuffer, (j + 1) & 0xf));

      const s = add(
        ...add(
          ...add(
            ...s1,
            ...retrieve(internalBuffer, (j + 9) & 0xf),
          ),
          ...s0,
        ),
        ...retrieve(internalBuffer, j),
      );
      assign(internalBuffer, j, ...s);
    }

    const sig1 = tmpSig1(...e);
    const ch = [
      (e[0] & f[0]) ^ (~e[0] & g[0]),
      (e[1] & f[1]) ^ (~e[1] & g[1]),
    ];
    const t1 = add(
      ...add(
        ...add(
          ...add(
            ...h,
            ...sig1,
          ),
          ...ch,
        ),
        ...retrieve(k, i),
      ),
      ...retrieve(internalBuffer, j),
    );

    const sig0 = tmpSig0(...a);

    const maj = [
      (a[0] & b[0]) ^ (a[0] & c[0]) ^ (b[0] & c[0]),
      (a[1] & b[1]) ^ (a[1] & c[1]) ^ (b[1] & c[1]),
    ];
    const t2 = add(...sig0, ...maj);

    h = g;
    g = f;
    f = e;
    e = add(...d, ...t1);
    d = c;
    c = b;
    b = a;
    a = add(...t1, ...t2);
  }

  assign(state, 0, ...add(...retrieve(state, 0), ...a));
  assign(state, 1, ...add(...retrieve(state, 1), ...b));
  assign(state, 2, ...add(...retrieve(state, 2), ...c));
  assign(state, 3, ...add(...retrieve(state, 3), ...d));
  assign(state, 4, ...add(...retrieve(state, 4), ...e));
  assign(state, 5, ...add(...retrieve(state, 5), ...f));
  assign(state, 6, ...add(...retrieve(state, 6), ...g));
  assign(state, 7, ...add(...retrieve(state, 7), ...h));
};


export default sha2MainLoop;
