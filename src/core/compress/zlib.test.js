import { ZlibCompressor } from './zlib';

import Encode from '../encode';

const { decode } = Encode.Base64Encoder;

const tests = [
  ['eJwzBAAAMgAy', '1'],
  ['eJxLTEpOSU1Lz8jMys7JzQMAKZ4Fqg==', 'abcdefghijklmn'],
  ['eJzLTS0uTkxPVcgljQYATbMVBA==', 'message message message message message message message'],
  ['eJzLTS0uTkxPVciF0AAvqwXr', 'message message'],
];

tests.forEach((i) => {
  it('should inflate short chunk of messages', expect(
    Array.from(ZlibCompressor.decompress(decode(i[0])))
      .map(byte => String.fromCharCode(byte))
      .join(''),
  ).toEqual(i[1]));
});
