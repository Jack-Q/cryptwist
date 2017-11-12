import TestEncoder from './encode.test-util';
import { AsciiArmoredEncoder } from './ascii-armored';


const cases = [
  ['Hello World', 'SGVsbG8gV29ybGQ=\n=uizE'],
];

TestEncoder(AsciiArmoredEncoder, cases);

// other failure cases
it('should refuse to decode', () => expect(() => AsciiArmoredEncoder.decode()).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => AsciiArmoredEncoder.decode('=')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => AsciiArmoredEncoder.decode('SGVsbG8gV29ybGQ=\n=uizS')).toThrowError(/invalid checksum/));
