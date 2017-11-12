const encoderName = 'Base32';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=';

// for string with character count other then a multiple of 5
// the remainder of which by 5 is used as index of the array
const paddingCountSet = [0, 6, 4, 3, 1, 0];

/**
 * Bit Pattern
 * From https://tools.ietf.org/html/rfc4648#section-9
 *
 *             1          2          3
 *   01234567 89012345 67890123 45678901 23456789
 * +--------+--------+--------+--------+--------+
 * |< 1 >< 2| >< 3 ><|.4 >< 5.|>< 6 ><.|7 >< 8 >|
 * +--------+--------+--------+--------+--------+
 *                                         <===> 8th character
 *                                   <====> 7th character
 *                               <===> 6th character
 *                         <====> 5th character
 *                   <====> 4th character
 *             <===> 3rd character
 *       <====> 2nd character
 *   <===> 1st character
 */

/**
 * @argument array Uint8Array
 */
const encode = (arr, len = arr.length, offset = 0) => {
  if (!(arr instanceof Uint8Array)) {
    console.warn('array to be encoded ought to be Uint8Array');
  }
  const sec = Math.ceil(len / 5);
  const pad = paddingCountSet[len % 5];
  const end = len - 1;

  return Array(sec).fill(0)
    .map((_, i) => [
                                                                          (arr[offset + i * 5 + 0] >> 3) & 0b11111,  // eslint-disable-line
      ((arr[offset + i * 5 + 0] << 2) & 0b11100) | (i * 5 + 1 > end ? 0 : (arr[offset + i * 5 + 1] >> 6) & 0b00011), // eslint-disable-line
                                                                          (arr[offset + i * 5 + 1] >> 1) & 0b11111,  // eslint-disable-line
      ((arr[offset + i * 5 + 1] << 4) & 0b10000) | (i * 5 + 2 > end ? 0 : (arr[offset + i * 5 + 2] >> 4) & 0b01111), // eslint-disable-line
      ((arr[offset + i * 5 + 2] << 1) & 0b11110) | (i * 5 + 3 > end ? 0 : (arr[offset + i * 5 + 3] >> 7) & 0b00001), // eslint-disable-line
                                                                          (arr[offset + i * 5 + 3] >> 2) & 0b11111,  // eslint-disable-line
      ((arr[offset + i * 5 + 3] << 3) & 0b11000) | (i * 5 + 4 > end ? 0 : (arr[offset + i * 5 + 4] >> 5) & 0b00111), // eslint-disable-line
       (arr[offset + i * 5 + 4] << 0) & 0b11111                                                                      // eslint-disable-line
    ].reduce((v, c) => v + alphabet[c], ''))
    .join('')
    .substr(0, 8 * sec - pad) + alphabet[32].repeat(pad);
};

const decode = (str = '') => {
  if (typeof str !== 'string') {
    console.warn('message to be decoded ought to be string');
  }
  if (str.length === 0) {
    return Uint8Array.from([]);
  }
  if (str.length % 8 !== 0) {
    throw 'decoder failure: invalid length of str';
  }

  const padIndex = str.indexOf(alphabet[32]);
  const pad = padIndex >= 0 ? str.length - padIndex : 0;
  if (pad > 0) {
    const padStr = str.substr(str.length - pad, pad);
    if (pad > 6) {
      throw 'decoder failure: too much padding character';
    }
    if (padStr !== alphabet[32].repeat(pad)) {
      throw `decoder failure: unexpected character found at the end which is ${padStr}${pad}`;
    }
  }
  if (paddingCountSet.lastIndexOf(pad) === -1) {
    throw 'decoder failure: invalid padding';
  }

  const len = str.length / 8 * 5 - 5 + paddingCountSet.lastIndexOf(pad);

  return Uint8Array.from(str.match(/......../g).map((sec, i) => {
    const mapped = sec.split('').map(v => alphabet.indexOf(v));

    const val = mapped.map((v, j) => {
      if (v === -1) {
        throw `decoder failure: unexpected value at ${i * 8 + j} (${sec[j]})`;
      }
      return v & 0b11111;
    });

    return [
      val[0] << 3 | val[1] >> 2,
      val[1] << 6 | val[2] << 1 | val[3] >> 4,
      val[3] << 4 | val[4] >> 1,
      val[4] << 7 | val[5] << 2 | val[6] >> 3,
      val[6] << 5 | val[7] >> 0,
    ];
  }).reduce((a, b) => a.concat(b)).slice(0, len));
};

const Base32Encoder = {
  name: encoderName,
  encode,
  decode,
  alphabet,
};

export default Base32Encoder;

// const test = (msg) => {
//   console.log("testing: " + msg)
//   const enc = encode(msg)
//   console.log("encoded: " + enc)
//   const dec = decode(enc)
//   console.log("decoded: " + dec)
// }

// test(Uint8Array.from([112]))
// test(Uint8Array.from([112, 213]))
// test(Uint8Array.from([112, 132, 122]))
// test(Uint8Array.from([112, 142, 221, 229]))
// test(Uint8Array.from([112, 207, 122, 119, 187]))
// test(Uint8Array.from([112, 111, 222, 098, 090, 012]))
// test(Uint8Array.from("HelloWorldJmnopqrstuvwxyz@".split('').map(s => s.charCodeAt(0))))
