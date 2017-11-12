const encoderName = 'Base16 (Hex)';

const alphabet = '0123456789ABCDEF';

/**
 * @argument array Uint8Array
 */
const encode = (arr, len = arr.length, offset = 0) => {
  if (!(arr instanceof Uint8Array)) {
    console.warn('array to be encoded ought to be Uint8Array');
  }
  return Array(len)
    .fill(0)
    .map((_, i) => `${alphabet[(arr[offset + i] >> 4) & 0xf]}${alphabet[arr[offset + i] & 0xf]}`)
    .join('');
};

const decode = (str = '') => {
  if (typeof str !== 'string') {
    console.warn('message to be decoded ought to be string');
  }
  if (str.length === 0) {
    return Uint8Array.from([]);
  }
  if (str.length % 2 !== 0) {
    throw 'decoder failure: invalid length of str';
  }
  return Uint8Array.from(str.match(/../g).map(sec => alphabet.indexOf(sec[0]) << 4 | alphabet.indexOf(sec[1])));
};

const Base16Encoder = {
  name: encoderName,
  encode,
  decode,
};

export default Base16Encoder;

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
// test(Uint8Array.from("HelloWorldJmnopqrstuvwxyz@".split('').map(s => s.charCodeAt(0))))
