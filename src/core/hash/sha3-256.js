import { Keccak } from './keccak/keccak';

export class SHA3_256 extends Keccak {
  constructor() {
    super(SHA3_256, 'SHA3-256', 512, 256);
  }

  static hash(data) {
    return new SHA3_256().hash(data);
  }
}

export default SHA3_256;
