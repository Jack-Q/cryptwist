import { SHA3_256Hash } from './sha3-256'; // eslint-disable-line camelcase
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(Encode.Base16Encoder.encode(SHA3_256Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md.toUpperCase()));

// Here cen use libdigest-sha3-perl (Debian) package which provides an global command
// echo -n "message" | sha3sum -a 256

const testCases = [
  ['', 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a'],
  ['\0', '5d53469f20fef4f8eab52b88044ede69c77a6a68a60728609fc4a65ff531e7d0'],
  ['Hello World', 'e167f68d6563d75bb25f3aa49c29ef612d41352dc00606de7cbd630bb2665f51'],
  ['The quick brown fox jumps over the lazy dog', '69070dda01975c8c120c3aada1b282394e7f032fa9cf32f4cb2259a0897dfc04'],
  ['The quick brown fox jumps over the lazy dog.', 'a80f839cd4f83f6c3dafc87feae470045e4eb0d366397d5c6ce34ba1739f734d'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(Encode.Base16Encoder.encode(SHA3_256Hash.hash(new Uint8Array(12000)))).toEqual('A225F2056DECCF04B5A14E76CF09DC54293F90E2B0958839AFC5987E8B9F8EF1'));
