const encoderName = 'ASCII';

export const AsciiEncoder = {
  title: encoderName,
  encode: (arr, len, off) => Array.from(arr.slice(off, off + len))
    .map(i => String.fromCharCode(i)).join(''),
  decode: str => Uint8Array.from(str.split('').map(i => i.charCodeAt(0))),
};

export const encode = AsciiEncoder.encode;
export const decode = AsciiEncoder.decode;

export default AsciiEncoder;
