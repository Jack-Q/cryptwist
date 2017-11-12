import { SHA3_384Hash } from './sha3-384'; // eslint-disable-line camelcase
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.HexEncoder.encode(SHA3_384Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md));

// Here cen use libdigest-sha3-perl (Debian) package which provides an global command
// echo -n "message" | sha3sum -a 224

const testCases = [
  ['', '0c63a75b845e4f7d01107d852e4c2485c51a50aaaa94fc61995e71bbee983a2ac3713831264adb47fb6bd1e058d5f004'],
  ['\0', '127677f8b66725bbcb7c3eae9698351ca41e0eb6d66c784bd28dcdb3b5fb12d0c8e840342db03ad1ae180b92e3504933'],
  ['Hello World', 'a78ec2851e991638ce505d4a44efa606dd4056d3ab274ec6fdbac00cde16478263ef7213bad5a7db7044f58d637afdeb'],
  ['The quick brown fox jumps over the lazy dog', '7063465e08a93bce31cd89d2e3ca8f602498696e253592ed26f07bf7e703cf328581e1471a7ba7ab119b1a9ebdf8be41'],
  ['The quick brown fox jumps over the lazy dog.', '1a34d81695b622df178bc74df7124fe12fac0f64ba5250b78b99c1273d4b080168e10652894ecad5f1f4d5b965437fb9'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.HexEncoder.encode(SHA3_384Hash.hash(new Uint8Array(12000))),
).toEqual('ba414645b06ea652014af8ca5e8a2b39b80783031a7fb2230aa59b1e5d5abe5d6d38ee56f6c6d9b2970f5bd3aeb56e03'));
