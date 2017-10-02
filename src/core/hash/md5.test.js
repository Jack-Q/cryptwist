import { MD5Hash, add32 } from './md5';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () =>
  expect(Encode.Base16Encoder.encode(MD5Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md.toUpperCase()));

const testCases = [
  ['', 'd41d8cd98f00b204e9800998ecf8427e'],
  // ['Hello World', 'b10a8db164e0754105b7a99be72e3fe5'],
  // ['The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
  // ['The quick brown fox jumps over the lazy dog.', 'e4d909c290d0fb1ca068ffaddf22cbd0'],
];

testCases.forEach(i => test(...i));


const testAdd32 = (a, b) => it(`should generate same result when adding ${a} anf ${b}`, () => expect(add32(a, b)).toEqual((a + b) & 0xffffffff));

[
  [1, 1],
  [10, 20],
  [0xfffff, 0xfffff],
  [0xffffffff, 0xffffffff],
].forEach(i => testAdd32(...i));
