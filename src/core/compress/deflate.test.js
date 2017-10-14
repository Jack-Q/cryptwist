import { DeflateCompressor } from './deflate';
import Encode from '../encode';

const { decode } = Encode.Base64Encoder;

const tests = [
  ['MwQA', '1'],
  ['S0xKTklNS8/IzMrOyc0DAA==', 'abcdefghijklmn'],
  ['y00tLk5MT1XIJY0GAA==', 'message message message message message message message'],
  ['y00tLk5MT1XIhdAA', 'message message'],
];

tests.forEach((i) => {
  it('should inflate short chunk of messages', expect(
    Array.from(DeflateCompressor.decompress(decode(i[0])))
      .map(byte => String.fromCharCode(byte))
      .join(''),
  ).toEqual(i[1]));
});

// const file = fs.readFileSync('rand.zlib');
// const printHash = buf => console.log(Encode.HexEncoder.encode(SHA256Hash.hash(buf)));
// const compressedFileBuffer = new Uint8Array(file.buffer);
// printHash(compressedFileBuffer);
// const decompressedFileBuffer = Deflate.decompress(compressedFileBuffer.slice(2, -4));
// printHash(decompressedFileBuffer);
