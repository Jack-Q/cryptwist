import { SHAKE256Hash } from './shake-256';

import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(Encode.HexEncoder.encode(SHAKE256Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0))), 1024))).toEqual(md));

// Here cen use libdigest-sha3-perl (Debian) package which provides an global command
// echo -n "message" | sha3sum -a 224

const testCases = [
  [
    '',
    '46b9dd2b0ba88d13233b3feb743eeb243fcd52ea62b81b82b50c27646ed5762fd75dc4ddd8c0f200cb05019d67b592f6fc821c49479ab48640292eacb3b7c4be' +
    '141e96616fb13957692cc7edd0b45ae3dc07223c8e92937bef84bc0eab862853349ec75546f58fb7c2775c38462c5010d846c185c15111e595522a6bcd16cf86',
  ],
  [
    '\0',
    'b8d01df855f7075882c636f6ddeacf41e5de0bbf30042ef0a86e36f4b8600d546c516501a6a3c821678d3d9943fa9e74b9b99fccd47aecc91dd1f4946b8355b3' +
    '0a500d7bd8081e67ad4599a5c8e23706803f955aeff1686e54cdf48840e32dd2342c1a26fb27aaec2b4fe5b9111f6497143cc59be6ff2abeff59230ca332b313',
  ],
  [
    'Hello World',
    '840d1ce81a4327840b54cb1d419907fd1f62359bad33656e058653d2e4172a43acc958dbec0cf0d473db458ce1c007aa6eb40eac92aa0e65202edb4d7feed378' +
    '8a77ed6a6ddc5abfbfbff72f22f49e667e45032c1ee8cfb079f8089b43d16ae6e58f063a4d93ef3699b32b9d00b33c372c10a48d72f64da02597f4fa23d5890a',
  ],
  [
    'The quick brown fox jumps over the lazy dog',
    '2f671343d9b2e1604dc9dcf0753e5fe15c7c64a0d283cbbf722d411a0e36f6ca1d01d1369a23539cd80f7c054b6e5daf9c962cad5b8ed5bd11998b40d5734442' +
    'bed798f6e5c915bd8bb07e0188d0a55c1290074f1c287af06352299184492cbdec9acba737ee292e5adaa445547355e72a03a3bac3aac770fe5d6b66600ff15d',
  ],
  [
    'The quick brown fox jumps over the lazy dog.',
    'bd225bfc8b255f3036f0c8866010ed0053b5163a3cae111e723c0c8e704eca4e5d0f1e2a2fa18c8a219de6b88d5917ff5dd75b5fb345e7409a3b333b508a65fb' +
    '1fd2849dc4f0a7195abce099dc6ac265012f542d628417605452f97a67eb737c91b75021a8823a8d04a2a0f26530fe4d42b41be8830cabf5929b43bb4cafc635',
  ],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(Encode.HexEncoder.encode(SHAKE256Hash.hash(new Uint8Array(12000), 1024))).toEqual('7e298304af3f494263c6e709a5020b7869800c07303a3fe230fe0a6c5f4f956951ef690f88f5e29a6e02a5b95f2b0b52a81331331cb0fbd1f30e624bafe0dcdc' +
  '8186ce0fe2c5f06f87328a4efdfe6ee9ce38c7491268af3c0847755122e8c131ce6d1bdce9aded5bb3d0956e7f330876f192808916ccf6c31a1e3d6476f49eb2'));
