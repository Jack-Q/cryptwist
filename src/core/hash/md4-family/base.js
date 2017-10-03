import { Hash, TODO } from '../../base/api';
import { Int64 } from '../../util/int64';

export class MD4HashBase extends Hash {
  constructor(HashClass, name) {
    super();
    this.HashClass = HashClass;
    this.name = name;
  }

  hash(data) {
    if (this.clean) {
      return this.endData(data);
    }
    // use static method to construct new hash
    return this.HashClass.hash(data);
  }

  init() {
    this.initState();
    this.clean = true;
    this.length = new Int64();
    this.buffer = new Uint8Array(64);
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

      // finalize padding
    this.buffer[this.bufferLength] = 0b10000000; // add a single '1' bit
    this.buffer.fill(0, this.bufferLength + 1);
    if (this.bufferLength >= 56) {
        // no sufficient space for writing padding length
      this.mainLoop();
      this.buffer.fill(0);
    }
    this.buffer.set(this.length.loBytesLE, 56);
    this.buffer.set(this.length.hiBytesLE, 60);
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
      if (this.bufferLength === 64) {
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

export default MD4HashBase;
