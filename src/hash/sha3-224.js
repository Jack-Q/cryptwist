import { Keccak } from './keccak/keccak';

export class SHA3_224Hash extends Keccak {

  static name = 'sha3-224';

  constructor() {
    super(SHA3_224Hash, 'SHA3-224', 448, 224);
  }

  static hash(data) {
    return new SHA3_224Hash().hash(data);
  }
}

export default SHA3_224Hash;
