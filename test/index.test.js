// eslint-disable-next-line
/// reference "../typings/index.d.ts"
// This file contains test to compiled source
import cryptwist from '..';

it('should list supported encoders', () => expect(cryptwist.encoder.encoderList).toBeInstanceOf(Array));
it('should list supported hash', () => expect(cryptwist.hash.hashList).toBeInstanceOf(Array));
it('should list supported block cipher', () => expect(cryptwist.blockCipher.blockCipherList).toBeInstanceOf(Array));
it('should list supported compressor', () => expect(cryptwist.compressor.compressorList).toBeInstanceOf(Array));
it('should list supported stream cipher', () => expect(cryptwist.streamCipher.streamCipherList).toBeInstanceOf(Array));

const encodeMessage = Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7, 8);
cryptwist.encoder.encoderList.forEach((encoderClass) => {
  const name = encoderClass.title;
  it('should report its name', () => expect(typeof name === 'string' && name.length > 0).toBe(true));
  it(`should encode and decode message for ${name}`, () =>
    expect(encoderClass.decode(encoderClass.encode(encodeMessage))).toEqual(encodeMessage));
});
cryptwist.hash.hashList.forEach((hashClass) => {
  const name = hashClass.title;
  it('should report its name', () => expect(typeof name === 'string' && name.length > 0).toBe(true));
});
cryptwist.blockCipher.blockCipherList.forEach((cipherClass) => {
  const name = cipherClass.title;
  it('should report its name', () => expect(typeof name === 'string' && name.length > 0).toBe(true));
});
cryptwist.compressor.compressorList.forEach((compressorClass) => {
  const name = compressorClass.title;
  it('should report its name', () => expect(typeof name === 'string' && name.length > 0).toBe(true));
});
cryptwist.streamCipher.streamCipherList.forEach((streamCipherClass) => {
  const name = streamCipherClass.title;
  it('should report its name', () => expect(typeof name === 'string' && name.length > 0).toBe(true));
});
