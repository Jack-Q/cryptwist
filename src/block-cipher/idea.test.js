import { IDEABlockCipher } from './idea';

const cipher = new IDEABlockCipher(Uint8Array.of(0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8));
const msg = Uint8Array.of(0, 0, 0, 1, 0, 2, 0, 3);
const enc = Uint8Array.of(63, 251, 49, 27, 10, 68, 6, 123);
it('should encrypt correctly', () => expect(cipher.encrypt(msg)).toEqual(enc));
it('should decrypt correctly', () => expect(cipher.decrypt(enc)).toEqual(msg));
