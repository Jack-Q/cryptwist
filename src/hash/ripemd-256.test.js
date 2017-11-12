
import { RIPEMD256Hash } from './ripemd-256';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(
  Encode.Base16Encoder.encode(RIPEMD256Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))))),
).toEqual(md.toUpperCase()));

const testCases = [
  ['', '02ba4c4e5f8ecd1877fc52d64d30e37a2d9774fb1e5d026380ae0168e3c5522d'],
  ['a', 'f9333e45d857f5d90a91bab70a1eba0cfb1be4b0783c9acfcd883a9134692925'],
  ['abc', 'afbd6e228b9d8cbbcef5ca2d03e6dba10ac0bc7dcbe4680e1e42d2e975459b65'],
  ['message digest', '87e971759a1ce47a514d5c914c392c9018c7c46bc14465554afcdf54a5070c0e'],
  ['abcdefghijklmnopqrstuvwxyz', '649d3034751ea216776bf9a18acc81bc7896118a5197968782dd1fd97d8d5133'],
  ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '3843045583aac6c8c8d9128573e7a9809afb2a0f34ccc36ea9e72f16f6368e3f'],
  ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', '5740a408ac16b720b84424ae931cbb1fe363d1d0bf4017f1a89f7ea6de77a0b8'],
  ['12345678901234567890123456789012345678901234567890123456789012345678901234567890', '06fdcc7a409548aaf91368c06a6275b553e3f099bf0ea4edfd6778df89a890dd'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(
  Encode.Base16Encoder.encode(RIPEMD256Hash.hash(new Uint8Array(12000))),
).toEqual('DBB3F8CD0F6110EF69FF471BEB5803A6C1F41D53E76EF24FCC5966039DDAA786'));
