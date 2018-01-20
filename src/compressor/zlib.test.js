import { ZlibCompressor } from './zlib';

import Encode from '../encode';

const { decode } = Encode.Base64Encoder;

// Tests for de-compressor
const tests = [
  ['eJwzBAAAMgAy', '1'],
  ['eJxLTEpOSU1Lz8jMys7JzQMAKZ4Fqg==', 'abcdefghijklmn'],
  ['eJzLTS0uTkxPVcgljQYATbMVBA==', 'message message message message message message message'],
  ['eJzLTS0uTkxPVciF0AAvqwXr', 'message message'],
];

tests.forEach((i) => {
  it('should inflate short chunk of messages', () => expect(Array.from(ZlibCompressor.decompress(decode(i[0])))
    .map(byte => String.fromCharCode(byte))
    .join('')).toEqual(i[1]));
});

// Tests for en-compressor
// since the core compress process of zlib is based on
// deflate implementation, the test here is focused on
// the wrapper format and the checksum (Adler32)
const compressTest = [
  '\0',
  'Hello World',
  'message and message',
];


compressTest.forEach(t => it(
  'should compress valid zlib format message',
  () => expect(ZlibCompressor.decompress(ZlibCompressor.compress(Encode.AsciiEncoder.decode(t))))
    .toEqual(Encode.AsciiEncoder.decode(t)),
));
