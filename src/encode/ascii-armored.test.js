import TestEncoder from './encode.test-util';
import { AsciiArmored } from './ascii-armored';


const cases = [
  ['Hello World', 'SGVsbG8gV29ybGQ=\n=uizE'],
];

TestEncoder(AsciiArmored, cases);

// other failure cases
it('should refuse to decode', () => expect(() => AsciiArmored.decode()).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => AsciiArmored.decode('=')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => AsciiArmored.decode('SGVsbG8gV29ybGQ=\n=uizS')).toThrowError(/invalid checksum/));
