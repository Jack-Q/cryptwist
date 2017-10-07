import { Keccak } from './keccak/keccak';

export class SHA3_512Hash extends Keccak {
  constructor() {
    super(SHA3_512Hash, 'SHA3-512', 1024, 512);
  }

  static hash(data) {
    return new SHA3_512Hash().hash(data);
  }
}

export default SHA3_512Hash;
