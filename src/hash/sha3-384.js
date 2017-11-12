import { Keccak } from './keccak/keccak';

// eslint-disable-next-line camelcase
export class SHA3_384Hash extends Keccak {

  static name = 'sha3-384';

  constructor() {
    super(SHA3_384Hash, 'SHA3-256', 768, 384);
  }

  static hash(data) {
    return new SHA3_384Hash().hash(data);
  }
}

// eslint-disable-next-line camelcase
export default SHA3_384Hash;
