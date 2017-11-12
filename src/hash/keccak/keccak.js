import { Sponge } from './sponge';
import { keccakP } from './keccak-p';

const KECCAK_B = 1600;
const KECCAK_NR = 24;

export class Keccak extends Sponge {

  constructor(HashClass, name, capacity, len, ...params) {
    super(HashClass, name, KECCAK_B, KECCAK_B - capacity, len, ...params);

    // two bits domain separation bits "01" + first padding bit "1" (reverse order)
    this.paddingFirst = 0b00000110;

    // last padding bit "1" (reverse order)
    this.paddingLast = 0b10000000;
  }

  func() {
    keccakP(KECCAK_B, KECCAK_NR, this.state);
  }

  pad(paddingResult) {
    if (paddingResult.finished) {
      return { finish: true };
    }
    this.buffer[this.bufferFillLength] ^= this.paddingFirst;
    this.buffer[this.buffer.length - 1] ^= this.paddingLast;
    return { finish: true };
  }
}

export default Keccak;
