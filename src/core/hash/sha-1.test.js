import { SHA1Hash } from './sha-1';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(SHA1Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -sha1

const testCases = [
  ['', 'da39a3ee5e6b4b0d3255bfef95601890afd80709'],
  ['\0', '5ba93c9db0cff93f52b521d7420e43f6eda2784f'],
  ['Hello World', '0a4d55a8d778e5022fab701977c5d840bbc486d0'],
  ['The quick brown fox jumps over the lazy dog', '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12'],
  ['The quick brown fox jumps over the lazy dog.', '408d94384216f890ff7a0c3528e8bed1e0b01621'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(SHA1Hash.hash(new Uint8Array(12000))),
).toEqual('7C400C3BCAB607A35F48F4A64076E23E0FB71846'));
