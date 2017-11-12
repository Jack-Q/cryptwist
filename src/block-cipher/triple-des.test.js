import { TripleDESBlockCipher } from './triple-des';

import { Encoder } from '../encode';

const { encode, decode } = Encoder.Base16Encoder;
const msg = decode('5468652071756663');

const doubleKeys = [
  '0123456789ABCDEF',
  '23456789ABCDEF01',
].map(decode);
const doubleCipher = new TripleDESBlockCipher(doubleKeys);
it('should be reversible', () => expect(encode(doubleCipher.decrypt(doubleCipher.encrypt(msg)))).toEqual('5468652071756663'));

const tripleKeys = [
  '0123456789ABCDEF',
  '23456789ABCDEF01',
  '456789ABCDEF0123',
].map(decode);
const tripleCipher = new TripleDESBlockCipher(tripleKeys);
it('should be reversible', () => expect(encode(tripleCipher.decrypt(tripleCipher.encrypt(msg)))).toEqual('5468652071756663'));
