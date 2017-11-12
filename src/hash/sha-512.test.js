import { SHA512Hash } from './sha-512';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(SHA512Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -sha256

const testCases = [
  ['', 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'],
  ['\0', 'b8244d028981d693af7b456af8efa4cad63d282e19ff14942c246e50d9351d22704a802a71c3580b6370de4ceb293c324a8423342557d4e5c38438f0e36910ee'],
  ['Hello World', '2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b'],
  ['The quick brown fox jumps over the lazy dog', '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6'],
  ['The quick brown fox jumps over the lazy dog.', '91ea1245f20d46ae9a037a989f54f1f790f0a47607eeb8a14d12890cea77a1bbc6c7ed9cf205e67b7f2b8fd4c7dfd3a7a8617e45f3c463d481c7e586c39ac1ed'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(SHA512Hash.hash(new Uint8Array(12000))),
).toEqual('A9FC937FCC9C515F971CDBD7D201CD0290A991DBDC4FD2B9F0B69CCA93549887F7FE09B92DA1A8F1FBCDF9AE1B85AC6E5A0A7F3557EBDC24321BB9532A3D1553'));
