import { Keccak } from './keccak/keccak';

export class SHA3_384Hash extends Keccak {
  constructor() {
    super(SHA3_384Hash, 'SHA3-256', 768, 384);
  }

  static hash(data) {
    return new SHA3_384Hash().hash(data);
  }
}

export default SHA3_384Hash;
