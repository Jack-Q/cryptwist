/**
 * Base64 encoding is used as an armor for integral value.
 *
 * This approach is also adopted by GPG as cipher encoding,
 * yet containing an extra CRC checksum encoded in Base64 and
 * separated using "=".
 */

const encoderName = "Base64"

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const urlAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

/**
 * @argument array Uint8Array
 */
const encode = (arr, len = arr.length, offset = 0) => {
  len -= offset;
  if (!(arr instanceof Uint8Array)) {
    console.warn("array to be encoded ought to be Uint8Array")
  }
  const sec = Math.ceil(len / 3);
  const pad = (3 - len % 3) % 3;
  const end = len - 1;

  return Array(sec).fill(0)
    .map((_, i) => [
                                                                      (arr[offset + i * 3 + 0] >> 2) & 077,
      ((arr[offset + i * 3 + 0] << 4) & 077) | (i * 3 + 1 > end ? 0 : (arr[offset + i * 3 + 1] >> 4) & 017),
      ((arr[offset + i * 3 + 1] << 2) & 077) | (i * 3 + 2 > end ? 0 : (arr[offset + i * 3 + 2] >> 6) & 003),
       (arr[offset + i * 3 + 2] << 0) & 077
    ].reduce((v, c) => v + alphabet[c], ''))
    .join('').substr(0, 4 * sec - pad) + alphabet[64].repeat(pad);
};

const decode = (str = "") => {
  if (typeof str !== 'string') {
    console.warn("message to be decoded ought to be string")
  }
  if (str.length === 0 || str.length % 4 !== 0) {
    throw "decoder failure: invalid length of str"
  }

  const padIndex = str.indexOf(alphabet[64]);
  const pad = padIndex >= 0 ? str.length - padIndex : 0;
  if (pad > 0) {
    const padStr = str.substr(str.length - pad, pad)
    if (padStr != alphabet[64].repeat(pad)) {
      throw "decoder failure: invalid character found at the end which is " + padStr + pad
    }
  }

  const len = str.length / 4 * 3 - pad;

  return Uint8Array.from(str.match(/..../g).map((sec, i) => { 
    const mapped = sec.split('').map(v => alphabet.indexOf(v));
    
    const val = mapped.map((v, j) => {
      if (v == -1) {
        throw `decoder failure: unexpected value at ${i * 4 + j} (${sec[j]})`
      }
      return v & 077;
    })

    return [
      val[0] << 2 | val[1] >> 4,
      val[1] << 4 | val[2] >> 2,
      val[2] << 6 | val[3] >> 0,
    ]
  }).reduce((a,b) => a.concat(b)).slice(0, len))
};

const Base64Encoder = {
  name: encoderName,
  encode,
  decode
};

export default Base64Encoder;