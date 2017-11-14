import { BigInt } from './big-int';


it('should parse binary string', () => expect(new BigInt('1010101001010101'.repeat(20), 2).toString(2)).toEqual('1010101001010101'.repeat(20)));
it('should parse binary string', () => expect(new BigInt('12301230'.repeat(20), 4).toString(4)).toEqual('12301230'.repeat(20)));
it('should parse binary string', () => expect(new BigInt('abcdef0123456789'.repeat(20), 16).toString(16)).toEqual('abcdef0123456789'.repeat(20)));
