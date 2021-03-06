import {
  initialPermute, finalPermute,
  initialBitPermute, finalBitPermute,
} from './perm';

const toBinary = k => Array.from(k).map(i => (256 + i).toString(2).slice(-8)).join(' ');
const toBinSub = s => toBinary(Array.of(...s[0], ...s[1]));

const testSuits = (data, permutedData) => {
  it('should permute data', () => expect(toBinSub(initialPermute(data))).toEqual(toBinSub(permutedData)));
  it('should permute data', () => expect(toBinSub(initialBitPermute(data))).toEqual(toBinSub(permutedData)));
  it('permutation operation is reversible', () => expect(finalPermute(initialPermute(data))).toEqual(data));
  it('permutation operation is reversible', () => expect(initialPermute(finalPermute(data))).toEqual(data));
  it('permutation operation (bit based) is reversible', () =>
    expect(toBinSub(finalBitPermute(initialBitPermute(data)))).toEqual(toBinSub(data)));
  it('permutation operations are equivalent', () =>
    expect(initialBitPermute(data)).toEqual(initialPermute(data)));
  it('reversed permutation operations are equivalent', () =>
    expect(toBinSub(finalBitPermute(data))).toEqual(toBinSub(finalPermute(data))));
};

const data = [
  {
    data: [Uint8Array.of(0xac, 0xbc, 0xcc, 0xdc), Uint8Array.of(0x95, 0x85, 0x75, 0x65)],
    permutedData: [Uint8Array.of(0xcc, 0x5a, 0xff, 0xf0), Uint8Array.of(0x3f, 0xc3, 0x0f, 0x00)],
  },
  {
    data: [
      Uint8Array.of(0b00000001, 0b00100011, 0b01000101, 0b01100111),
      Uint8Array.of(0b10001001, 0b10101011, 0b11001101, 0b11101111),
    ],
    permutedData: [
      Uint8Array.of(0b11001100, 0b00000000, 0b11001100, 0b11111111),
      Uint8Array.of(0b11110000, 0b10101010, 0b11110000, 0b10101010),
    ],
  },
];

data.forEach(dataForTest => testSuits(dataForTest.data, dataForTest.permutedData));
