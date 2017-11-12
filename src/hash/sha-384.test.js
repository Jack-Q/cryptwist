import { SHA384Hash } from './sha-384';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(SHA384Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -sha256

const testCases = [
  ['', '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b'],
  ['\0', 'bec021b4f368e3069134e012c2b4307083d3a9bdd206e24e5f0d86e13d6636655933ec2b413465966817a9c208a11717'],
  ['Hello World', '99514329186b2f6ae4a1329e7ee6c610a729636335174ac6b740f9028396fcc803d0e93863a7c3d90f86beee782f4f3f'],
  ['The quick brown fox jumps over the lazy dog', 'ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1'],
  ['The quick brown fox jumps over the lazy dog.', 'ed892481d8272ca6df370bf706e4d7bc1b5739fa2177aae6c50e946678718fc67a7af2819a021c2fc34e91bdb63409d7'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(SHA384Hash.hash(new Uint8Array(12000))),
).toEqual('6254E0698139082F306B1D5B9A445636386F5015D5F00313CC9767E54F7671A0B83F256C9DE7D071A0980A93DE7C2365'));
