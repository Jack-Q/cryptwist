import generateSubKey from './sub-key';

const subKey = generateSubKey(Uint8Array.from([220, 120, 98, 12, 43, 201, 98]));
it('should generate sub-key', () => expect(subKey).toBeTruthy());
it('should generate 16 sub-keys', () => expect(subKey.length).toBe(16));
it('should generate 16 sub-keys of 48 bits', () => expect(subKey.every(i => i.length === 6)).toBeTruthy());
