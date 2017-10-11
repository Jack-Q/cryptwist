import { RIPEMD160Hash } from './ripemd-160';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(RIPEMD160Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -md5

const testCases = [
  ['', '9c1185a5c5e9fc54612808977ee8f548b2258d31'],
  ['a', '0bdc9d2d256b3ee9daae347be6f4dc835a467ffe'],
  ['abc', '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc'],
  ['\0', 'C81B94933420221A7AC004A90242D8B1D3E5070D'],
  ['Hello World', 'A830D7BEB04EB7549CE990FB7DC962E499A27230'],
  ['The quick brown fox jumps over the lazy dog', '37F332F68DB77BD9D7EDD4969571AD671CF9DD3B'],
  ['The quick brown fox jumps over the lazy dog.', 'FC850169B1F2CE72E3F8AA0AEB5CA87D6F8519C6'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(RIPEMD160Hash.hash(new Uint8Array(12000))),
).toEqual('5B35DDF57520FD96BE98AAD74C383822663CC907'));
