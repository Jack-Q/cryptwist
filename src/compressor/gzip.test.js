import { GzipCompressor } from './gzip';

import Encode from '../encode';

const { decode } = Encode.Base64Encoder;

const tests = [
  ['H4sICHQ34lkAA3RtcC5qcwDzSM3JyQcAgonR9wUAAAA=', 'Hello'],
  ['H4sIAB8e4lkAA0tMSk5JTUvPyMzKzsnNAwB4lQ1ADgAAAA==', 'abcdefghijklmn'],
];

tests.forEach((i) => {
  it('should inflate short chunk of messages', expect(Array.from(GzipCompressor.decompress(decode(i[0])))
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
  () => expect(GzipCompressor.decompress(GzipCompressor.compress(Encode.AsciiEncoder.decode(t))))
    .toEqual(Encode.AsciiEncoder.decode(t)),
));

