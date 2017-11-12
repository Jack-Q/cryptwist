import { Keccak } from './keccak/keccak';

 // eslint-disable-next-line camelcase
export class SHA3_512Hash extends Keccak {

  static title = 'sha3-512';

  constructor() {
    super(SHA3_512Hash, 'SHA3-512', 1024, 512);
  }

  static hash(data) {
    return new SHA3_512Hash().hash(data);
  }
}

 // eslint-disable-next-line camelcase
export default SHA3_512Hash;
