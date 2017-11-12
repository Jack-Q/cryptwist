import { MD4HashBase } from './md4-family/base';

// 20 bytes initial state, add an extra value to MD4/MD5
const initState = Uint32Array.of(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);

// Z constants is used as a index of message buffer
const zl = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
];
const zr = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
];

// Y constants is used as a additional term for each 16 rounds
const yl = [0, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc];
const yr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0];

// S constants is used as a shift amount of round result
const sl = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
];
const sr = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
];

/**
 *
 * @param {Uint32Array} state
 * @param {Uint8Array} buffer
 */
const ripemd128MainLoop = (state, buffer) => {
  // RIPEMD-160 includes a parallel processing rounds
  // which denotes as left rounds and right rounds
  let [al, bl, cl, dl] = state;
  let [ar, br, cr, dr] = state;

  for (let i = 0; i < 64; i += 1) {
    // RIPEMD-160 follows big little mode
    const gl = zl[i];
    const mgl =
      (buffer[gl * 4 + 3] << 24) |
      (buffer[gl * 4 + 2] << 16) |
      (buffer[gl * 4 + 1] << 8) |
      (buffer[gl * 4 + 0] << 0);

    const gr = zr[i];
    const mgr =
      (buffer[gr * 4 + 3] << 24) |
      (buffer[gr * 4 + 2] << 16) |
      (buffer[gr * 4 + 1] << 8) |
      (buffer[gr * 4 + 0] << 0);

    let tl = 0; let tr = 0;

    // the order of primitive manipulation is reversed from left rounds to right rounds
    if (i < 16) {
      tl = bl ^ cl ^ dl;
      tr = (br & dr) | (cr & ~dr);
    } else if (i < 32) {
      tl = (bl & cl) | (~bl & dl);
      tr = (br | ~cr) ^ dr;
    } else if (i < 48) {
      tl = (bl | ~cl) ^ dl;
      tr = (br & cr) | (~br & dr);
    } else {
      tl = (bl & dl) | (cl & ~dl);
      tr = br ^ cr ^ dr;
    }

    const vl = al + tl + mgl + yl[i >>> 4];
    [al, bl, cl, dl] = [
      dl,
      ((vl << sl[i]) | (vl >>> (32 - sl[i]))),
      bl,
      cl,
    ];

    const vr = ar + tr + mgr + yr[i >>> 4];
    [ar, br, cr, dr] = [
      dr,
      ((vr << sr[i]) | (vr >>> (32 - sr[i]))),
      br,
      cr,
    ];
  }

  const t = state[0];
  state[0] = state[1] + cl + dr;
  state[1] = state[2] + dl + ar;
  state[2] = state[3] + al + br;
  state[3] = t + bl + cr;
};

export class RIPEMD128Hash extends MD4HashBase {

  static title = 'ripemd-128';

  constructor() {
    super(RIPEMD128Hash, 'RIPEMD-128');
  }

  mainLoop() {
    ripemd128MainLoop(this.state, this.buffer);
  }

  initState() {
    this.state = new Uint32Array(4);
  }

  resetState() {
    initState.forEach((v, i) => { this.state[i] = v; });
  }

  exportState() {
    return new Uint8Array(Uint32Array.of(...this.state).buffer);
  }

  static hash(data) {
    return new RIPEMD128Hash().hash(data);
  }
}

export default RIPEMD128Hash;
