const encoderName = 'ASCII';

export const AsciiEncoder = {
  title: encoderName,
  encode: (arr, len = arr.length, off = 0) => {
    if (!(arr instanceof Uint8Array)) {
      console.warn('array to be encoded ought to be Uint8Array');
    }
    return Array.from(arr.slice(off, off + len))
      .map(i => String.fromCharCode(i)).join('');
  },
  decode: (str) => {
    if (typeof str !== 'string') {
      console.warn('message to be decoded ought to be string');
    }
    return Uint8Array.from(str.split('').map(i => i.charCodeAt(0)));
  },
};

export const encode = AsciiEncoder.encode;
export const decode = AsciiEncoder.decode;

export default AsciiEncoder;
