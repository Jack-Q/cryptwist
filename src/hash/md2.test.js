import { MD2Hash } from './md2';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(MD2Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -md4

const testCases = [
  ['', '8350e5a3e24c153df2275c9f80692773'],
  ['a', '32ec01ec4a6dac72c0ab96fb34c0b5d1'],
  ['abc', 'da853b0d3f88d99b30283a69e6ded6bb'],
  ['message digest', 'ab4f496bfb2a530b219ff33031fe06b0'],
  ['abcdefghijklmnopqrstuvwxyz', '4e8ddff3650292ab5a4108c3aa47940b'],
  ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'da33def2a42df13975352846c30338cd'],
  ['12345678901234567890123456789012345678901234567890123456789012345678901234567890', 'd5976f79d83d3a0dc9806c3c66f3efd8'],
  ['\0', 'EE8DBAE3BC62BDC94EA63F69C1BC26C9'],
  ['Hello World', '27454D000B8F9AAA97DA6DE8B394D986'],
  ['The quick brown fox jumps over the lazy dog', '03D85A0D629D2C442E987525319FC471'],
  ['The quick brown fox jumps over the lazy dog.', '71EAA7E440B611E41A6F0D97384B342A'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(MD2Hash.hash(new Uint8Array(12000))),
).toEqual('1CD1BE2B5A50EF8C68EF3DCDA0140B5C'));
