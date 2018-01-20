import { HexEncoder } from '../encode';

const { encode: enc } = HexEncoder;

export const testCipher = (CipherModeClass, plainText, testCases) => {
  testCases.forEach((c) => {
    it(
      'should encrypt message using cipher mode correctly',
      () => expect(enc(new CipherModeClass(c[0], c[1], c[2]).encrypt(plainText)))
        .toEqual(enc(c[3])),
    );
  });
};

export const testDecipher = (CipherModeClass, plainText, testCases) => {
  testCases.forEach((c) => {
    it(
      'should decipher message using cipher mode correctly',
      () => expect(enc(new CipherModeClass(c[0], c[1], c[2]).decrypt(c[3])))
        .toEqual(enc(plainText)),
    );
  });
};
