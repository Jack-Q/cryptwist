import { Keccak } from './keccak/keccak';

export class SHAKE128Hash extends Keccak {
  constructor(d) {
    if (d === undefined) { throw 'SHAKE extendable output function (XOF) requires an parameter specifying the output length'; }
    super(SHAKE128Hash, 'SHAKE128', 256, d);
    this.paddingFirst = 0b00011111; // four bits domain separation bits "1111" + first padding bit "1" (reverse order)
  }

  static hash(data, d) {
    return new SHAKE128Hash(d).hash(data);
  }
}

export default SHAKE128Hash;
