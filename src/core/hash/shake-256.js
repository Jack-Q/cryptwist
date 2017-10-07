import { Keccak } from './keccak/keccak';

export class SHAKE256Hash extends Keccak {
  constructor(d) {
    if (d === undefined) { throw 'SHAKE extendable output function (XOF) requires an parameter specifying the output length'; }
    super(SHAKE256Hash, 'SHAKE128', 512, d);
    this.paddingFirst = 0b00011111; // four bits domain separation bits "1111" + first padding bit "1" (reverse order)
  }

  static hash(data, d) {
    return new SHAKE256Hash(d).hash(data);
  }
}

export default SHAKE256Hash;
