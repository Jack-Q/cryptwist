import TestEncoder from './encode.test-util';
import { Base32Encoder } from './base32';


const cases = [
  ['Hello World', 'JBSWY3DPEBLW64TMMQ======'],
  ['Hello', 'JBSWY3DP'],
  // following test cases are from RFC4648
  ['', ''],
  ['f', 'MY======'],
  ['fo', 'MZXQ===='],
  ['foo', 'MZXW6==='],
  ['foob', 'MZXW6YQ='],
  ['fooba', 'MZXW6YTB'],
  ['foobar', 'MZXW6YTBOI======'],

];

TestEncoder(Base32Encoder, cases);

// other failure cases
it('should refuse to decode', () => expect(Base32Encoder.decode()).toEqual(Uint8Array.from([])));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('1212')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('2=======')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('321=====')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('321ACB==')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('321ACB=A')).toThrowError(/unexpected/));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('as123===')).toThrowError(/unexpected/));
it('should refuse to decode', () => expect(() => Base32Encoder.decode('%$%$====')).toThrowError(/unexpected/));
