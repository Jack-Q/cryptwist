import { generateSubKey, permuteKey } from './sub-key';

import { checkKey } from './check-key';

const subKey = generateSubKey(Uint8Array.from([220, 120, 98, 12, 43, 201, 98]));
it('should generate sub-key', () => expect(subKey).toBeTruthy());
it('should generate 16 sub-keys', () => expect(subKey.length).toBe(16));
it('should generate 16 sub-keys of 48 bits', () => expect(subKey.every(i => i.length === 6)).toBeTruthy());

const toBinary = k => Array.from(k).map(i => (256 + i).toString(2).slice(-8)).join(' ');

const core = checkKey(Uint8Array.of(
  0b00010011, 0b00110100, 0b01010111, 0b01111001,
  0b10011011, 0b10111100, 0b11011111, 0b11110001,
)).core;
const pk = permuteKey(core);
const subKey2 = generateSubKey(core);
// subKey2.map(k => console.log(toBinary(k)));

it('', () => expect(toBinary(pk).replace(/ /g, '')).toEqual('1111000 0110011 0010101 0101111 0101010 1011001 1001111 0001111'.replace(/ /g, '')));

it('', () => expect(toBinary(subKey2[0]).replace(/ /g, '')).toEqual('000110 110000 001011 101111 111111 000111 000001 110010'.replace(/ /g, '')));
