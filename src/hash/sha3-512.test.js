import { SHA3_512Hash } from './sha3-512'; // eslint-disable-line camelcase
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(Encode.HexEncoder.encode(SHA3_512Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md));

// Here cen use libdigest-sha3-perl (Debian) package which provides an global command
// echo -n "message" | sha3sum -a 224

const testCases = [
  [
    '',
    'a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26',
  ],
  [
    '\0',
    '7127aab211f82a18d06cf7578ff49d5089017944139aa60d8bee057811a15fb55a53887600a3eceba004de51105139f32506fe5b53e1913bfa6b32e716fe97da',
  ],
  ['Hello World',
    '3d58a719c6866b0214f96b0a67b37e51a91e233ce0be126a08f35fdf4c043c6126f40139bfbc338d44eb2a03de9f7bb8eff0ac260b3629811e389a5fbee8a894',
  ],
  [
    'The quick brown fox jumps over the lazy dog',
    '01dedd5de4ef14642445ba5f5b97c15e47b9ad931326e4b0727cd94cefc44fff23f07bf543139939b49128caf436dc1bdee54fcb24023a08d9403f9b4bf0d450',
  ],
  [
    'The quick brown fox jumps over the lazy dog.',
    '18f4f4bd419603f95538837003d9d254c26c23765565162247483f65c50303597bc9ce4d289f21d1c2f1f458828e33dc442100331b35e7eb031b5d38ba6460f8',
  ],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(Encode.HexEncoder.encode(SHA3_512Hash.hash(new Uint8Array(12000)))).toEqual('986323b11111c52e259a411c46a8e61c29a7863bf3ae4015290f02f1ac612dd4a4335135bcf959d347b200a8a924cd0e17090c92153e12894ae7e57fb405424c'));
