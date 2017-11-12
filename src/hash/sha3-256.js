import { Keccak } from './keccak/keccak';

export class SHA3_256Hash extends Keccak {

  static name = 'sha3-256';

  constructor() {
    super(SHA3_256Hash, 'SHA3-256', 512, 256);
  }

  static hash(data) {
    return new SHA3_256Hash().hash(data);
  }
}

export default SHA3_256Hash;
