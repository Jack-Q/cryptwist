import { initialPermute, finalPermute, initialBitPermute, finalBitPermute } from './perm';

const toBinary = k => Array.from(k).map(i => (256 + i).toString(2).slice(-8)).join(' ');
const toBinSub = s => toBinary(Array.of(...s[0], ...s[1]));

const data = [Uint8Array.of(0xac, 0xbc, 0xcc, 0xdc), Uint8Array.of(0x95, 0x85, 0x75, 0x65)];

// it('should permute data', () => expect(initialPermute(data)).toEqual(data));
// it('should permute data', () => expect(initialBitPermute(data)).toEqual(data));
it('permutation operation is reversible', () => expect(finalPermute(initialPermute(data))).toEqual(data));
it('permutation operation is reversible', () => expect(initialPermute(finalPermute(data))).toEqual(data));
// it('permutation operation (bit based) is reversible', () => expect(finalBitPermute(initialBitPermute(data))).toEqual(data));
// it('permutation operations are equivalent', () => expect(initialBitPermute(data)).toEqual(initialPermute(data)));
// it('reversed permutation operations are equivalent', () => expect(toBinSub(finalBitPermute(data))).toEqual(toBinSub(finalPermute(data))));


const data2 = [
  Uint8Array.of(0b00000001, 0b00100011, 0b01000101, 0b01100111),
  Uint8Array.of(0b10001001, 0b10101011, 0b11001101, 0b11101111),
];
const ip2 = initialPermute(data2);
it('', () => expect(toBinSub(ip2).replace(/ /g, ''))
  .toEqual('1100 1100 0000 0000 1100 1100 1111 1111 1111 0000 1010 1010 1111 0000 1010 1010'.replace(/ /g, '')));
