import { Base32Encoder } from './base32';

const encoderName = 'Base32-Hex';

const hexAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUV=';

/**
 * @argument array Uint8Array
 */
export const encode = (arr, len = arr.length, offset = 0) =>
  Base32Encoder.encode(arr, len, offset).split('').map(c => hexAlphabet[Base32Encoder.alphabet.indexOf(c)]).join('');

export const decode = (str = '') => {
  if (typeof str !== 'string') {
    console.warn('message to be decoded ought to be string');
  }
  if (str.length === 0) {
    return Uint8Array.from([]);
  }
  if (str.length % 8 !== 0) {
    throw 'decoder failure: invalid length of str';
  }
  return Base32Encoder.decode(str.split('').map((c) => {
    if (c.toUpperCase() !== c) {
      console.warn('hex string are recommend to be in upper case');
    }
    const index = hexAlphabet.indexOf(c.toUpperCase());
    if (index === -1) { throw 'decoder failure: unexpected input'; }
    return Base32Encoder.alphabet[index];
  }).join(''));
};

export const Base32HexEncoder = {
  title: encoderName,
  encode,
  decode,
  alphabet: hexAlphabet,
};
export default Base32HexEncoder;
