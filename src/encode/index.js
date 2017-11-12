import { Base64Encoder } from './base64';
import { Base32Encoder } from './base32';
import { Base16Encoder } from './base16';
import { Base85Encoder } from './base85';
import { HexEncoder } from './hex';
import { AsciiArmoredEncoder } from './ascii-armored';
import { AsciiEncoder } from './ascii';

const encoderList = [
  Base16Encoder, Base32Encoder,
  Base64Encoder, Base85Encoder,
  AsciiArmoredEncoder, HexEncoder,
  AsciiEncoder,
];

const getEncoder = name => encoderList.find(i => i.name === name);

const Encoder = {
  Base64Encoder,
  Base32Encoder,
  Base16Encoder,
  Base85Encoder,
  HexEncoder,
  AsciiArmoredEncoder,
  AsciiEncoder,

  encoderList,
  getEncoder,
};

export { Base64Encoder } from './base64';
export { Base32Encoder } from './base32';
export { Base16Encoder } from './base16';
export { Base85Encoder } from './base85';
export { HexEncoder } from './hex';
export { AsciiArmoredEncoder } from './ascii-armored';
export { AsciiEncoder } from './ascii';
export { getEncoder, encoderList, Encoder };
export default Encoder;
