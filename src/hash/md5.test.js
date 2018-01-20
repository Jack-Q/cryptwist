import { MD5Hash } from './md5';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(Encode.Base16Encoder.encode(MD5Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -md5

const testCases = [
  ['', 'd41d8cd98f00b204e9800998ecf8427e'],
  ['\0', '93b885adfe0da089cdf634904fd59f71'],
  ['Hello World', 'b10a8db164e0754105b7a99be72e3fe5'],
  ['The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
  ['The quick brown fox jumps over the lazy dog.', 'e4d909c290d0fb1ca068ffaddf22cbd0'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(Encode.Base16Encoder.encode(MD5Hash.hash(new Uint8Array(12000)))).toEqual('21D9938F335C6BFAB0EEAED58673B073'));
