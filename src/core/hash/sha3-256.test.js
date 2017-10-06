import { SHA3_256 } from './sha3-256';

import Encoder from '../encode';

const { encode, decode } = Encoder.HexEncoder;

const hash = encode(SHA3_256.hash(decode('')));
it('should calculate message digest correctly', () =>
  expect(hash).toEqual('a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a'));
