import { SHA3_224Hash } from './sha3-224'; // eslint-disable-line camelcase
import Encode from '../encode';

const test = (msg, md) =>
  it(`should hash "${msg}" to "${md}"`, () =>
    expect(Encode.HexEncoder.encode(SHA3_224Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md));

// Here cen use libdigest-sha3-perl (Debian) package which provides an global command
// echo -n "message" | sha3sum -a 224

const testCases = [
  ['', '6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7'],
  ['\0', 'bdd5167212d2dc69665f5a8875ab87f23d5ce7849132f56371a19096'],
  ['Hello World', '8e800079a0b311788bf29353f400eff969b650a3597c91efd9aa5b38'],
  ['The quick brown fox jumps over the lazy dog', 'd15dadceaa4d5d7bb3b48f446421d542e08ad8887305e28d58335795'],
  ['The quick brown fox jumps over the lazy dog.', '2d0708903833afabdd232a20201176e8b58c5be8a6fe74265ac54db0'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () =>
  expect(Encode.HexEncoder.encode(SHA3_224Hash.hash(new Uint8Array(12000)))).toEqual('8aeb73ef0ab083d4e1f2d5cb9430f990460a9e0d0cc2812436280b4e'));
