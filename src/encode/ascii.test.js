import TestEncoder from './encode.test-util';
import { AsciiEncoder } from './ascii';


const cases = [
  ['Hello World', 'Hello World'],
  ['', ''],
  ['f', 'f'],
  ['fo', 'fo'],
  ['foo', 'foo'],
  ['foob', 'foob'],
  ['fooba', 'fooba'],
  ['foobar', 'foobar'],
];

TestEncoder(AsciiEncoder, cases);
