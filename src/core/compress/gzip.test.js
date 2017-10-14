import { GzipCompressor } from './gzip';

import Encode from '../encode';

const { decode } = Encode.Base64Encoder;

const tests = [
  ['H4sICHQ34lkAA3RtcC5qcwDzSM3JyQcAgonR9wUAAAA=', 'Hello'],
  ['H4sIAB8e4lkAA0tMSk5JTUvPyMzKzsnNAwB4lQ1ADgAAAA==', 'abcdefghijklmn'],
];

tests.forEach((i) => {
  it('should inflate short chunk of messages', expect(
    Array.from(GzipCompressor.decompress(decode(i[0])))
      .map(byte => String.fromCharCode(byte))
      .join(''),
  ).toEqual(i[1]));
});
