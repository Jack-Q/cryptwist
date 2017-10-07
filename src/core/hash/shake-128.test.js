import { SHAKE128Hash } from './shake-128';

import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.HexEncoder.encode(SHAKE128Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))), 1024)),
).toEqual(md));

// Here cen use libdigest-sha3-perl (Debian) package which provides an global command
// echo -n "message" | sha3sum -a 224

const testCases = [
  [
    '',
    '7f9c2ba4e88f827d616045507605853ed73b8093f6efbc88eb1a6eacfa66ef263cb1eea988004b93103cfb0aeefd2a686e01fa4a58e8a3639ca8a1e3f9ae57e2' +
    '35b8cc873c23dc62b8d260169afa2f75ab916a58d974918835d25e6a435085b2badfd6dfaac359a5efbb7bcc4b59d538df9a04302e10c8bc1cbf1a0b3a5120ea',
  ],
  [
    '\0',
    '0b784469a0628e03861cd8a196dfafa0e9e8056d04cddcc49f0746b9ad43ccb291e0c86535ff6254400d4df18bc0b840d8d505d37fd1b211c20af49fd8c8ee60' +
    '4299a5ece841b097b58b6bf541f9e38062ed091aa6258edf998c34b125199668da92d870fbfb05a939fc731802fb0d3a2e2bf3b328154aa087f10c93b81f9832',
  ],
  ['Hello World',
    '1227c5f882f9c57bf2e3e48d2c87eb20f382a4b639b54d26f6d595ff3db9064d074ee788f0747ca3fc46ce86936cfc6bd3638dae5a2b7d6592522998d6da6faa' +
    '5f5d415d99d5565146ee3cd2b8ec1538bc62dde946949b23b8cf3ca3e47f352d3c462f1687108434f784952ccfe326afdf7853b3982022ca1482bc9cd18f9a6c',
  ],
  [
    'The quick brown fox jumps over the lazy dog',
    'f4202e3c5852f9182a0430fd8144f0a74b95e7417ecae17db0f8cfeed0e3e66eb5585ec6f86021cacf272c798bcf97d368b886b18fec3a571f096086a523717a' +
    '3732d50db2b0b7998b4117ae66a761ccf1847a1616f4c07d5178d0d965f9feba351420f8bfb6f5ab9a0cb102568eabf3dfa4e22279f8082dce8143eb78235a1a',
  ],
  [
    'The quick brown fox jumps over the lazy dog.',
    '634069e6b13c3af64c57f05babf5911b6acf1d309b9624fc92b0c0bd9f27f5386331af1672c94b194ce623030744b31e848b7309ee7182c4319a1f67f8644d20' +
    '34039832313286eb06af2e3fa8d3caa89c72638f9d1b26151d904ed006bd9ae7688f99f57d4195c5cee9eb51508c49169df4c5ee6588e458a69fdc7878215555',
  ],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.HexEncoder.encode(SHAKE128Hash.hash(new Uint8Array(12000), 1024)),
).toEqual('c002abf16180a34740523d1cc66cd2bda2b8f9e67551e78c253cad481f65ac31e4452edf4805b40533b4e1362112c5a832115a662c17a85a41ea3c41e0628945' +
'21a6bc697c3954ac6a32844b94d5e58ee46594fef8951968e44cef4aebc2ed5c490c09a29b80f60b0ae931c9955420c9b641798f605e20f4733cfe3dd6f5716f'));
