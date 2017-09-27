import TestEncoder from './encode.test-util';
import Base32 from './base32';


const cases = [
  ['Hello World', 'JBSWY3DPEBLW64TMMQ======'],
  ['Hello', 'JBSWY3DP'],
];

TestEncoder(Base32, cases);

// other failure cases
it('should refuse to decode', () => expect(() => Base32.decode()).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base32.decode('')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base32.decode('2=======')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32.decode('321=====')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32.decode('321ACB==')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32.decode('321ACB=A')).toThrowError(/unexpected/));
it('should refuse to decode', () => expect(() => Base32.decode('as123===')).toThrowError(/unexpected/));
it('should refuse to decode', () => expect(() => Base32.decode('%$%$====')).toThrowError(/unexpected/));
