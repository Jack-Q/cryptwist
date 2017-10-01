import { desFunc, expansion, sBoxSubstitute, xor, permutation } from './des-func';

const toBinary = k => Array.from(k).map(i => (256 + i).toString(2).slice(-8)).join(' ');

const data = Uint8Array.of(0b11110000, 0b10101010, 0b11110000, 0b10101010);
const key = Uint8Array.of(0b00011011, 0b00000010, 0b11101111, 0b11111100, 0b01110000, 0b01110010);

const exp = expansion(data);
it('should expand data', () => expect(toBinary(exp).replace(/ /g, ''))
  .toEqual('011110 100001 010101 010101 011110 100001 010101 010101'.replace(/ /g, '')));

const expK = xor(exp, key);
it('should apply sub-key', () => expect(toBinary(expK).replace(/ /g, ''))
.toEqual('011000 010001 011110 111010 100001 100110 010100 100111'.replace(/ /g, '')));

const subs = sBoxSubstitute(expK);
it('should substitute with S-Box', () => expect(toBinary(subs).replace(/ /g, ''))
  .toEqual('0101 1100 1000 0010 1011 0101 1001 0111'.replace(/ /g, '')));

const res = permutation(subs);
it('should apply plain permutation', () => expect(toBinary(res).replace(/ /g, ''))
  .toEqual('0010 0011 0100 1010 1010 1001 1011 1011'.replace(/ /g, '')));

it('should follow the whole process', () => expect(toBinary(desFunc(data, key))).toEqual(toBinary(res)));
