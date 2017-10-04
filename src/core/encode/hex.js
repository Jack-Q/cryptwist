import Base16Encoder from './base16';

const encoderName = 'Hex (Base16, lowercase)';

const HexEncoder = {
  name: encoderName,
  encode: (arr, len, off) =>
    Base16Encoder.encode(arr, len, off).toLowerCase(),
  decode: str => Base16Encoder.decode(str.toUpperCase()),
};

export default HexEncoder;
