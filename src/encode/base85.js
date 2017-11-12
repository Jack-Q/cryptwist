const encoderName = 'Base85 (Ascii-85)';

// Generate the alphabet via following code:
// Array(85).fill(33).map((v, i) => String.fromCharCode(v + i)).join('')
const alphabet = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu';

/**
 * @argument array Uint8Array
 */
export const encode = (arr, len = arr.length, offset = 0) => {
  if (!(arr instanceof Uint8Array)) {
    console.warn('array to be encoded ought to be Uint8Array');
  }
  const sec = Math.ceil(len / 4);
  const pad = (4 - len % 4) % 4;

  const str = Array(sec).fill(0).map((_, i) => {
    const padPos = i * 4 + 3 < len ? 0 : pad;
    const sum =
        (((0xff & arr[offset + i * 4 + 0]) << 23) * 2)
        + ((0xff & (padPos >= 3 ? 0 : arr[offset + i * 4 + 1])) << 16)
        + ((0xff & (padPos >= 2 ? 0 : arr[offset + i * 4 + 2])) << 8)
        + ((0xff & (padPos >= 1 ? 0 : arr[offset + i * 4 + 3])));

    // for all zero section, packing it with a shorthand as 'z' which will be
    // encoded as !!!!! by base conversion
    if (sum === 0x00000000 && (pad === 0 || i * 4 + 3 < len)) { return 'z'; }
    let quotient = sum;
    return Array(5).fill(0).map(() => {
      const val = quotient % 85;
      quotient = (quotient - val) / 85;
      return alphabet[val];
    }).reverse()
      .join('');
  }).join('');

  return `<~${str.substr(0, str.length - pad)}~>`;
};

export const decode = (str = '') => {
  if (typeof str !== 'string') {
    console.warn('message to be decoded ought to be string');
  }
  if (str.length < 4) {
    throw 'decoder failure: invalid length of str';
  }
  if (!str.startsWith('<~') || !str.endsWith('~>')) {
    throw "decoder failure: Ascii85 requires content to be wrapped into `<~' `~>' pair";
  }

  // expand `z' abbreviation
  const cnt = str.substr(2, str.length - 4).replace(/z/g, alphabet[0].repeat(5));
  const pad = (5 - cnt.length % 5) % 5;

  // padding character should be 0 to 3, no valid scenario will generate 4 padding characters
  if (pad === 4) {
    throw 'decoder failure: invalid length of str';
  }

  const data = (cnt + alphabet[84].repeat(pad)).match(/...../g).map((sec, s) => {
    const sum = Array(5).fill(0).map((_, i) => {
      const index = alphabet.indexOf(sec[i]);
      if (index === -1) {
        throw `decoder failure: unresolved content section in Ascii85 code at ${s * 5 + i}(${sec[i]})`;
      }
      return index;
    }).reduce((a, b) => a * 85 + b);
    if (sum < 0 || sum > 0xffffffff) {
      throw 'decoder failure: unresolved content section in Ascii85 code';
    }
    return [
      (sum & 0xff000000) >> 24,
      (sum & 0x00ff0000) >> 16,
      (sum & 0x0000ff00) >> 8,
      (sum & 0x000000ff) >> 0,
    ];
  }).reduce((a, b) => a.concat(b));

  return Uint8Array.from(data.slice(0, data.length - pad));
};

export const Base85Encoder = {
  title: encoderName,
  encode,
  decode,
};

export default Base85Encoder;

