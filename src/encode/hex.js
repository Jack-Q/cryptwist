import { Base16Encoder } from './base16';

const encoderName = 'Hex (Base16, lowercase)';

export const HexEncoder = {
  title: encoderName,
  encode: (arr, len, off) =>
    Base16Encoder.encode(arr, len, off).toLowerCase(),
  decode: str => Base16Encoder.decode(str.toUpperCase()),
};

export const encode = HexEncoder.encode;
export const decode = HexEncoder.decode;

export default HexEncoder;
