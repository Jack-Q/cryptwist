import TestEncoder from './encode.test-util';
import { Base32Hex } from './base32-hex';


const cases = [
  ['Hello World', '91IMOR3F41BMUSJCCG======'],
  ['Hello', '91IMOR3F'],
  // following test cases are from RFC4648
  ['', ''],
  ['f', 'CO======'],
  ['fo', 'CPNG===='],
  ['foo', 'CPNMU==='],
  ['foob', 'CPNMUOG='],
  ['fooba', 'CPNMUOJ1'],
  ['foobar', 'CPNMUOJ1E8======'],

];

TestEncoder(Base32Hex, cases);

// other failure cases
it('should accept empty', () => expect(Base32Hex.decode()).toEqual(Uint8Array.from([])));

it('should refuse to decode', () => expect(() => Base32Hex.decode('1212')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base32Hex.decode('2=======')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32Hex.decode('321=====')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32Hex.decode('321ACB==')).toThrowError(/padding/));
it('should refuse to decode', () => expect(() => Base32Hex.decode('321ACB=A')).toThrowError(/unexpected/));
it('should refuse to decode', () => expect(() => Base32Hex.decode('%$%$====')).toThrowError(/unexpected/));

it('should warn lower case', () => expect(() => Base32Hex.decode('as123===')).toThrowError(/warning/));
