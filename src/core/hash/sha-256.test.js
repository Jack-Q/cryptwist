import { SHA256Hash } from './sha-256';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(SHA256Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -sha1

const testCases = [
  ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['\0', '6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d'],
  ['Hello World', 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'],
  ['The quick brown fox jumps over the lazy dog', 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592'],
  ['The quick brown fox jumps over the lazy dog.', 'ef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(SHA256Hash.hash(new Uint8Array(12000))),
).toEqual('69011D94AE0D50D20321C0BE964C7257'));
