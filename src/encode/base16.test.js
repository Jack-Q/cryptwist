import TestEncoder from './encode.test-util';
import { Base16 } from './base16';


const cases = [
  ['Hello World', '48656C6C6F20576F726C64'],
  // Following test cases are from rfc4648
  ['', ''],
  ['f', '66'],
  ['fo', '666F'],
  ['foo', '666F6F'],
  ['foob', '666F6F62'],
  ['fooba', '666F6F6261'],
  ['foobar', '666F6F626172'],
];

TestEncoder(Base16, cases);

// other failure cases
it('should refuse to decode', () => expect(Base16.decode()).toEqual(Uint8Array.from([])));
it('should refuse to decode', () => expect(() => Base16.decode('A')).toThrowError(/invalid length of str/));
