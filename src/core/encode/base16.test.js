import TestEncoder from './encode.test-util';
import Base16 from './base16';


const cases = [
  ['Hello World', '48656C6C6F20576F726C64'],
];

TestEncoder(Base16, cases);

// other failure cases
it('should refuse to decode', () => expect(() => Base16.decode()).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base16.decode('')).toThrowError(/invalid length of str/));
