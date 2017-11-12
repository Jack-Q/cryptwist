
const k = Uint32Array.of(
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
);

/**
 *
 * @param {Uint32Array} state
 * @param {Uint8Array} buffer
 */
export const sha2MainLoop = (state, buffer) => {
  let [a, b, c, d, e, f, g, h] = state;

  // for buffer expansion
  const internalBuffer = new Uint32Array(16);

  for (let i = 0; i < 64; i += 1) {
    // message buffer and expansion
    const j = i & 0xf;
    if (i < 16) {
      // SHA-1 is conforming big-endian pattern
      internalBuffer[i] =
        (buffer[i * 4 + 0] << 24) |
        (buffer[i * 4 + 1] << 16) |
        (buffer[i * 4 + 2] << 8) |
        (buffer[i * 4 + 3] << 0);
    } else {
      const s10 = internalBuffer[(j + 14) & 0xf];
      const s1 = ((s10 >>> 17) | (s10 << (32 - 17))) ^
        ((s10 >>> 19) | (s10 << (32 - 19))) ^ (s10 >>> 10);

      const s00 = internalBuffer[(j + 1) & 0xf];
      const s0 = ((s00 >>> 7) | (s00 << (32 - 7))) ^
        ((s00 >>> 18) | (s00 << (32 - 18))) ^ (s00 >>> 3);

      internalBuffer[j] =
        s1 + internalBuffer[(j + 9) & 0xf] +
        s0 + internalBuffer[(j + 0) & 0xf];
    }

    const sig1 =
      ((e >>> 6) | (e << (32 - 6))) ^
      ((e >>> 11) | (e << (32 - 11))) ^
      ((e >>> 25) | (e << (32 - 25)));
    const ch = (e & f) ^ (~e & g);
    const t1 = h + sig1 + ch + k[i] + internalBuffer[j];

    const sig0 =
      ((a >>> 2) | (a << (32 - 2))) ^
      ((a >>> 13) | (a << (32 - 13))) ^
      ((a >>> 22) | (a << (32 - 22)));
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const t2 = sig0 + maj;

    h = g;
    g = f;
    f = e;
    e = d + t1;
    d = c;
    c = b;
    b = a;
    a = t1 + t2;
  }

  state[0] += a;
  state[1] += b;
  state[2] += c;
  state[3] += d;
  state[4] += e;
  state[5] += f;
  state[6] += g;
  state[7] += h;
};

export default sha2MainLoop;
