import { Base64Encoder } from './base64';

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
  return Uint8Array.from([
    (crc & 0xFF0000) >> 16,
    (crc & 0x00FF00) >> 8,
    (crc & 0x0000ff) >> 0,
  ]);
};

/**
 * @argument array Uint8Array
 */
export const encode = (arr, len = arr.length, offset = 0) => {
  if (!(arr instanceof Uint8Array)) {
    console.warn('array to be encoded ought to be Uint8Array');
  }

  const content = Base64Encoder.encode(arr, len, offset);
  const crc = Base64Encoder.encode(crc24Check(arr, len, offset));

  return `${content}\n=${crc}`;
};

export const decode = (str = '') => {
  if (typeof str !== 'string') {
    console.warn('message to be decoded ought to be string');
  }

  const splitPivot = str.lastIndexOf('=');
  const content = Base64Encoder.decode(str.substr(0, splitPivot).trim());
  const crcChecksum = Base64Encoder.decode(str.substr(splitPivot + 1, 4));
  const crc = crc24Check(content);

  for (let i = 0; i < 3; i += 1) {
    if (crc[i] !== crcChecksum[i]) { throw 'invalid checksum'; }
  }

  return content;
};

export const AsciiArmoredEncoder = {
  title: encoderName,
  encode,
  decode,
};

export default AsciiArmoredEncoder;
