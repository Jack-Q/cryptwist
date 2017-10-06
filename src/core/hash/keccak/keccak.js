import { Sponge } from './sponge';
import { keccakP } from './keccak-p';

const KECCAK_B = 1600;
const KECCAK_NR = 24;

export class Keccak extends Sponge {

  constructor(HashClass, name, capacity, len, ...params) {
    super(HashClass, name, KECCAK_B, KECCAK_B - capacity, len, ...params);
    this.paddingFirst = 0x06;
    this.paddingLast = 0x80;
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
