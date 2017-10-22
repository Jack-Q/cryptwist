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
  it('should inflate short chunk of messages', () => expect(
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

const compressTests = [
  '0011223344000111222333444000011112222333344440000011111222223333344444'.repeat(50),
  'Hello World'.repeat(100) + 'World Hello'.repeat(100),
  'message message message message'.repeat(100),
  // random test
  // Array(80 * (2 ** 10)).fill(0).map(i => String.fromCharCode(Math.random() * 128)).join(''),
];
compressTests.forEach((i) => {
  const msg = Uint8Array.from(i.split('').map(ch => ch.charCodeAt(0)));
  const t = opt => () => {
    const comp = DeflateCompressor.compress(msg, opt);
    const deComp = DeflateCompressor.decompress(comp);
    console.log(`compression ratio: ${(comp.length / msg.length * 100).toFixed(2)}%`);
    return expect(deComp).toEqual(msg);
  };
  it('should compress a decompress-able package in copy mode', t({ algorithm: 'copy' }));
  it('should compress a decompress-able package in match mode', t({ algorithm: 'runBytes', encode: 'forceNoCompress' }));
  it('should compress a decompress-able package in run-bytes mode', t({ algorithm: 'runBytes', encode: 'forceStaticHuff' }));
  it('should compress a decompress-able package in run-bytes mode', t({ algorithm: 'runBytes', encode: 'forceDynamicHuff' }));
  it('should compress a decompress-able package in match mode', t({ algorithm: 'huffman', encode: 'forceNoCompress' }));
  it('should compress a decompress-able package in Huffman mode', t({ algorithm: 'huffman', encode: 'forceStaticHuff' }));
  it('should compress a decompress-able package in Huffman mode', t({ algorithm: 'huffman', encode: 'forceDynamicHuff' }));
  it('should compress a decompress-able package in match mode', t({ algorithm: 'match', encode: 'forceNoCompress' }));
  it('should compress a decompress-able package in match mode', t({ algorithm: 'match', encode: 'forceDynamicHuff' }));
  it('should compress a decompress-able package in match mode', t({ algorithm: 'match', encode: 'forceStaticHuff' }));
  it('should compress a decompress-able package in lazy match mode', t({ algorithm: 'lazyMatch', encode: 'forceNoCompress' }));
  it('should compress a decompress-able package in lazy match mode', t({ algorithm: 'lazyMatch', encode: 'forceDynamicHuff' }));
  it('should compress a decompress-able package in lazy match mode', t({ algorithm: 'lazyMatch', encode: 'forceStaticHuff' }));
})
;
