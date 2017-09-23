import Base64Encoder from './base64';
import Base32Encoder from './base32';
import Base16Encoder from './base16';
import Base85Encoder from './base85';
import AsciiArmoredEncoder from './ascii-armored';

const encoders = [Base16Encoder, Base32Encoder, Base64Encoder, Base85Encoder, AsciiArmoredEncoder];

const Encoder = {
  Base64Encoder,
  Base32Encoder,
  Base16Encoder,
  Base85Encoder,
  AsciiArmoredEncoder,
  encoders,

  getEncoder(name) {
    return encoders.find(i => i.name === name);
  },
};

export default Encoder;
