import Base64Encoder from './base64';

const encoderName = 'Ascii Armored';

const CRC_24_INIT = 0x00B704CE;
const CRC_24_POLY = 0x01864CFB;

const crc24Check = (arr, len = arr.length, offset = 0) => {
  let crc = CRC_24_INIT;
  for (let i = 0; i < len; i += 1) {
    crc ^= arr[offset + i] << 16;
    for (let j = 0; j < 8; j += 1) {
      crc <<= 1;
      if (crc & 0x01000000) { crc ^= CRC_24_POLY; }
    }
  }
  return crc & 0xFFFFFF;
};

/**
 * @argument array Uint8Array
 */
const encode = (arr, len = arr.length, offset = 0) => {
  if (!(arr instanceof Uint8Array)) {
    console.warn('array to be encoded ought to be Uint8Array');
  }

  const content = Base64Encoder.encode(arr, len, offset);
  const crc = crc24Check(arr, len, offset);

  return content + crc;
};

const decode = (str = '') => {
  if (typeof str !== 'string') {
    console.warn('message to be decoded ought to be string');
  }
  if (str.length === 0 || str.length % 4 !== 0) {
    throw 'decoder failure: invalid length of str';
  }

  return Base64Encoder.decode(str);
};

const AsciiArmoredEncoder = {
  name: encoderName,
  encode,
  decode,
};

export default AsciiArmoredEncoder;
