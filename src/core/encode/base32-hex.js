import Base32 from './base32';

const encoderName = 'Base32-Hex';

const hexAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUV=';

/**
 * @argument array Uint8Array
 */
const encode = (arr, len = arr.length, offset = 0) => Base32.encode(arr, len, offset).split('').map(c => hexAlphabet[Base32.alphabet.indexOf(c)]).join('');

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
  return Base32.decode(str.split('').map((c) => {
    if (c.toUpperCase() !== c) {
      console.warn('hex string are recommend to be in upper case');
    }
    const index = hexAlphabet.indexOf(c.toUpperCase());
    if (index === -1) { throw 'decoder failure: unexpected input'; }
    return Base32.alphabet[index];
  }).join(''));
};

const Base32Hex = {
  name: encoderName,
  encode,
  decode,
  alphabet: hexAlphabet,
};
export default Base32Hex;
