import { Keccak } from './keccak/keccak';

 // eslint-disable-next-line camelcase
export class SHA3_224Hash extends Keccak {

  static name = 'sha3-224';

  constructor() {
    super(SHA3_224Hash, 'SHA3-224', 448, 224);
  }

  static hash(data) {
    return new SHA3_224Hash().hash(data);
  }
}

 // eslint-disable-next-line camelcase
export default SHA3_224Hash;
