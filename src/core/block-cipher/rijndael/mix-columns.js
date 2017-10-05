import { m2, m3, m9, mb, md, me } from './multipication';

// mix-column is treat a column of state as a polynomial over GF(2^8)
// multiply it with: a(x) = {03} x^3 + {01} x^2 + {01} x + {02} (in hex: 0x03010102)
// and modulo with the fixed term: x^4 + 1 (in hex: 0x01_00000001)

// For the multiplication:
// the result can be expanded and simplified as follows:
// c(x) = s(x) * a(x)  =(Expand)=>
// c6 * x^6 + c5 * x^5 + c4 * x^4 + c3 * x^3 + c2 * x^2 + c1 * x + c0 = s(x) * a(x)
//   where:
// c6 = s3 * a3                                     = {03}s3
// c5 = s3 * a2 <+> s2 * a3                         = {01}s3 <+> {03}s2
// c4 = s3 * a1 <+> s2 * a2 <+> s1 * a3             = {01}s3 <+> {01}s2 <+> {03}s1
// c3 = s3 * a0 <+> s2 * a1 <+> s1 * a2 <+> s0 * a3 = {02}s3 <+> {01}s2 <+> {01}s1 <+> {03}s0
// c2 =             s2 * a0 <+> s1 * a1 <+> s0 * a2 =            {02}s2 <+> {01}s1 <+> {01}s0
// c1 =                         s1 * a0 <+> s0 * a1 =                       {02}s1 <+> {01}s0
// c0 =                                     s0 * a0 =                                  {02}s0

// For the modulation:
// the result can be expanded as:
// s'(x) = c(x) mod (x^4 + 1)
// s'3 = c6 + c3 = {03}s3 <+> {02}s2 <+> {01}s1 <+> {01}s0
// s'2 = c5 + c2 = {01}s3 <+> {03}s2 <+> {02}s1 <+> {01}s0
// s'1 = c4 + c1 = {01}s3 <+> {01}s2 <+> {03}s1 <+> {02}s0
// s'0 = c3      = {02}s3 <+> {01}s2 <+> {01}s1 <+> {03}s0


// s'0 = {02}s0 <+> {03}s1 <+> {01}s2 <+> {01}s3
const s0 = (c0, c1, c2, c3) => m2(c0) ^ m3(c1) ^ c2 ^ c3;

// s'1 = {01}s0 <+> {02}s1 <+> {03}s2 <+> {01}s3
const s1 = (c0, c1, c2, c3) => c0 ^ m2(c1) ^ m3(c2) ^ c3;

// s'2 = {01}s0 <+> {01}s1 <+> {02}s2 <+> {02}s3
const s2 = (c0, c1, c2, c3) => c0 ^ c1 ^ m2(c2) ^ m3(c3);

// s'3 = {03}s0 <+> {01}s1 <+> {01}s2 <+> {02}s3
const s3 = (c0, c1, c2, c3) => m3(c0) ^ c1 ^ c2 ^ m2(c3);


/**
 * mix column routine
 * @param {{u8: Uint8Array}} state
 */
export const mixColumns = (state) => {
  const u8 = state.u8;

  for (let c = 0; c < 4; c += 1) {
    const c0 = u8[0 * 4 + c];
    const c1 = u8[1 * 4 + c];
    const c2 = u8[2 * 4 + c];
    const c3 = u8[3 * 4 + c];

    u8[0 * 4 + c] = s0(c0, c1, c2, c3);
    u8[1 * 4 + c] = s1(c0, c1, c2, c3);
    u8[2 * 4 + c] = s2(c0, c1, c2, c3);
    u8[3 * 4 + c] = s3(c0, c1, c2, c3);
  }
  return state;
};

// for the inverse routine, the inverse of polynomial a(x) should be used instead
// a^-1(x) * a(x) = 1 (mod x^4 + 1)

// since a(x) = {03} x^3 + {01} x^2 + {01} x + {02}
// the a^-1(x) will be: a^-1(x) = {0b} x^3 + {0d} x^2 + {09} x + {0e}
// so that: (with modulo applied)
// a(x) * a^-1(x) =
//        ({03}{0e} <+> {01}{09} <+> {01}{0d} <+> {02}{0b}) x^3
//        ({01}{0e} <+> {01}{09} <+> {02}{0d} <+> {03}{0b}) x^2
//        ({01}{0e} <+> {02}{09} <+> {03}{0d} <+> {01}{0b}) x
//        ({02}{0e} <+> {03}{09} <+> {01}{0d} <+> {01}{0b})
//      = ({12} <+> {09} <+> {0d} <+> {16}) x^3
//        ({0e} <+> {09} <+> {1a} <+> {1d}) x^2
//        ({0e} <+> {12} <+> {17} <+> {0b}) x
//        ({1c} <+> {1b} <+> {0d} <+> {0b})
//      = 1

// the calculation of is'(x) = is(x) * a^-1(x), expand like the previous procedure
// it requires more multiplication calculation over GF(2^8)


// is'0 = {0e}is0 <+> {0b}is1 <+> {0d}is2 <+> {09}is3
const is0 = (c0, c1, c2, c3) => me(c0) ^ mb(c1) ^ md(c2) ^ m9(c3);

// is'1 = {09}is0 <+> {0e}is1 <+> {0b}is2 <+> {0d}is3
const is1 = (c0, c1, c2, c3) => m9(c0) ^ me(c1) ^ mb(c2) ^ md(c3);

// is'2 = {0d}is0 <+> {09}is1 <+> {0e}is2 <+> {0b}is3
const is2 = (c0, c1, c2, c3) => md(c0) ^ m9(c1) ^ me(c2) ^ mb(c3);

// is'3 = {0b}is0 <+> {0d}is1 <+> {09}is2 <+> {0e}is3
const is3 = (c0, c1, c2, c3) => mb(c0) ^ md(c1) ^ m9(c2) ^ me(c3);

/**
 * inverse mix column routine
 * @param {{u8: Uint8Array}} state
 */
export const invMixColumns = (state) => {
  const u8 = state.u8;

  for (let c = 0; c < 4; c += 1) {
    const c0 = u8[0 * 4 + c];
    const c1 = u8[1 * 4 + c];
    const c2 = u8[2 * 4 + c];
    const c3 = u8[3 * 4 + c];

    u8[0 * 4 + c] = is0(c0, c1, c2, c3);
    u8[1 * 4 + c] = is1(c0, c1, c2, c3);
    u8[2 * 4 + c] = is2(c0, c1, c2, c3);
    u8[3 * 4 + c] = is3(c0, c1, c2, c3);
  }
  return state;
};

export default { mixColumns, invMixColumns };
