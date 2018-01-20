
import { RIPEMD128Hash } from './ripemd-128';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(Encode.Base16Encoder.encode(RIPEMD128Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md.toUpperCase()));

const testCases = [
  ['', 'cdf26213a150dc3ecb610f18f6b38b46'],
  ['a', '86be7afa339d0fc7cfc785e72f578d33'],
  ['abc', 'c14a12199c66e4ba84636b0f69144c77'],
  ['message digest', '9e327b3d6e523062afc1132d7df9d1b8'],
  ['abcdefghijklmnopqrstuvwxyz', 'fd2aa607f71dc8f510714922b371834e'],
  ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'd1e959eb179c911faea4624c60c5c702'],
  ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', 'a1aa0689d0fafa2ddc22e88b49133a06'],
  ['12345678901234567890123456789012345678901234567890123456789012345678901234567890', '3f45ef194732c2dbb2c4a2c769795fa3'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(Encode.Base16Encoder.encode(RIPEMD128Hash.hash(new Uint8Array(12000)))).toEqual('EEB9A4E987F6A6E14EB26B9A3E05CF64'));
