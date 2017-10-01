import { initialPermute, finalPermute, initialBitPermute, finalBitPermute } from './perm';


const data = [Uint8Array.of(0xac, 0xbc, 0xcc, 0xdc), Uint8Array.of(0x95, 0x85, 0x75, 0x65)];

// it('should permute data', () => expect(initialPermute(data)).toEqual(data));
// it('should permute data', () => expect(initialBitPermute(data)).toEqual(data));
it('permutation operation is reversible', () => expect(finalPermute(initialPermute(data))).toEqual(data));
it('permutation operation is reversible', () => expect(initialPermute(finalPermute(data))).toEqual(data));
// it('permutation operation (bit based) is reversible', () => expect(finalBitPermute(initialBitPermute(data))).toEqual(data));
// it('permutation operations are equivalent', () => expect(initialBitPermute(data)).toEqual(initialPermute(data)));
// it('reversed permutation operations are equivalent', () => expect(finalBitPermute(data)).toEqual(finalPermute(data)));
