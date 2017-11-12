import { MD4Hash } from './md4';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(MD4Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -md4

const testCases = [
  ['', '31d6cfe0d16ae931b73c59d7e0c089c0'],
  ['\0', '47c61a0fa8738ba77308a8a600f88e4b'],
  ['Hello World', '77a781b995cf1cfaf39d9e2f5910c2cf'],
  ['The quick brown fox jumps over the lazy dog', '1bee69a46ba811185c194762abaeae90'],
  ['The quick brown fox jumps over the lazy dog.', '2812c6c7136898c51f6f6739ad08750e'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(MD4Hash.hash(new Uint8Array(12000))),
).toEqual('69011D94AE0D50D20321C0BE964C7257'));
