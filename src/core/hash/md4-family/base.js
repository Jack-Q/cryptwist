import { Hash, TODO } from '../../base/api';
import { Int64, Int128 } from '../../util/big-int';

export class MD4HashBase extends Hash {

  hash(data) {
    if (this.clean) {
      return this.endData(data);
    }
    // use static method to construct new hash
    return this.HashClass.hash(data);
  }

  init(HashClass, name, endian = 'LE', largeBuffer = false) {
    this.HashClass = HashClass;
    this.name = name;
    this.endian = endian;
    this.largeBuffer = largeBuffer;

    this.initState();
    this.clean = true;
    this.length = this.largeBuffer ? new Int128() : new Int64();
    this.buffer = new Uint8Array(this.largeBuffer ? 128 : 64);
    this.bufferLength = 0;
  }

  reset() {
    this.resetState();
    this.clean = true;
    this.length.val = 0;
    this.buffer.fill(0);
    this.bufferLength = 0;
  }

  endData(data) {
    this.feedData(data);
    const originalLength = this.endian === 'LE' ? this.length.bytesLE : this.length.bytesBE;
    const lengthFieldOffset = this.buffer.length - originalLength.length;

    // finalize padding
    this.buffer[this.bufferLength] = 0b10000000; // add a single '1' bit
    this.buffer.fill(0, this.bufferLength + 1);

    if (this.bufferLength >= lengthFieldOffset) {
        // no sufficient space for writing padding length
      this.mainLoop();
      this.buffer.fill(0);
    }

    this.buffer.set(originalLength, lengthFieldOffset);
    this.mainLoop();

    const result = this.exportState();
    this.reset();
    return result;
  }

  feedData(data) {
    if (data.length === 0) {
      return;
    }

    this.clean = false;
    let pos = 0;
    while (pos < data.length) {
      const len = Math.min(data.length - pos, this.buffer.length - this.bufferLength);
      this.buffer.set(data.slice(pos, pos + len), this.bufferLength);
      this.bufferLength += len;
      pos += len;
      if (this.bufferLength === this.buffer.length) {
        this.mainLoop();
        this.bufferLength = 0;
      }
    }

    this.length.addNumberToLength(data.length * 8);
  }


  mainLoop() {
    TODO(this);
  }

  initState() {
    TODO(this);
  }

  resetState() {
    TODO(this);
  }

  exportState() {
    TODO(this);
  }
}

// export state as big-endian format
export const exportUint8ArrayBE = state =>
  Uint8Array.from(Array.from(state).map(i => [
    (i >>> 24) & 0xff,
    (i >>> 16) & 0xff,
    (i >>> 8) & 0xff,
    (i >>> 0) & 0xff,
  ]).reduce((a, b) => a.concat(b)));

export default MD4HashBase;
