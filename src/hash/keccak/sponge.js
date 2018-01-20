import { Hash, TODO } from '../../base/api';

export class Sponge extends Hash {
  init(HashClass, name, width, rate, digestLen, ...params) {
    if (width % 32 !== 0 || rate % 32 !== 0) {
      throw 'both the width and rate of the sponge structure should be a multiple of 32';
    }

    // sponge structure related attributes
    this.HashClass = HashClass;
    this.name = name;
    this.width = width; // the width of the sponge, with is the sum of rate and capacity
    this.rate = rate; // the rate of absorbing and squeezing
    this.digestLen = digestLen;
    this.params = params;

    // internal state of the sponge
    this.clean = true;
    this.length = 0; // data length
    this.state = new Uint32Array(width / 32);
    this.buffer = new Uint8Array(rate / 8);
    this.bufferFillLength = 0;
  }

  reset() {
    this.clean = true;
    this.length = 0;
    this.state.fill(0);
    this.buffer.fill(0);
    this.bufferFillLength = 0;
  }

  endData(data) {
    this.feedData(data);
    // padding
    let paddingResult = { finish: false };
    while (!paddingResult.finish) {
      paddingResult = this.pad(paddingResult);
      this.absorbData();
      this.func();
    }

    // keep squeezing the sponge until the digest of desired length is filled
    const result = new Uint8Array(this.digestLen / 8);
    for (let l = 0; l < result.length; l += this.buffer.length) {
      this.squeezeData();
      result.set(this.buffer.slice(0, Math.min(this.buffer.length, result.length - l)), l);
      this.func();
    }
    this.reset();
    return result;
  }

  feedData(data) {
    // ignore empty data feed
    if (data === undefined || data.length === 0) {
      return;
    }

    this.clean = false;
    let pos = 0;
    while (pos < data.length) {
      const len = Math.min(data.length - pos, this.buffer.length - this.bufferFillLength);
      this.buffer.set(data.slice(pos, pos + len), this.bufferFillLength);
      this.bufferFillLength += len;
      pos += len;
      if (this.bufferFillLength === this.buffer.length) {
        this.absorbData();
        this.func();
        this.bufferFillLength = 0;
      }
    }
    this.length += data.length;
  }

  hash(data) {
    if (this.clean) {
      return this.endData(data);
    }
    return this.HashClass.hash(data, ...this.params);
  }

  /**
   * Absorb data from internal buffer to current state (the sponge)
   */
  absorbData() {
    for (let i = 0; i < this.rate / 64; i += 1) {
      this.state[i * 2] ^=
        this.buffer[i * 8 + 7] << 24 |
        this.buffer[i * 8 + 6] << 16 |
        this.buffer[i * 8 + 5] << 8 |
        this.buffer[i * 8 + 4] << 0;
      this.state[i * 2 + 1] ^=
        this.buffer[i * 8 + 3] << 24 |
        this.buffer[i * 8 + 2] << 16 |
        this.buffer[i * 8 + 1] << 8 |
        this.buffer[i * 8 + 0] << 0;
    }
  }

  /**
   * Squeeze data into internal buffer from current state (the sponge)
   */
  squeezeData() {
    for (let i = 0; i < this.rate / 64; i += 1) {
      const s1 = this.state[i * 2];
      this.buffer[i * 8 + 7] = (s1 >> 24) & 0xff;
      this.buffer[i * 8 + 6] = (s1 >> 16) & 0xff;
      this.buffer[i * 8 + 5] = (s1 >> 8) & 0xff;
      this.buffer[i * 8 + 4] = (s1 >> 0) & 0xff;
      const s2 = this.state[i * 2 + 1];
      this.buffer[i * 8 + 3] = (s2 >> 24) & 0xff;
      this.buffer[i * 8 + 2] = (s2 >> 16) & 0xff;
      this.buffer[i * 8 + 1] = (s2 >> 8) & 0xff;
      this.buffer[i * 8 + 0] = (s2 >> 0) & 0xff;
    }
  }

  func() { TODO(this); }

  /**
   * This is used to handle padding for message
   *
   * if the padding for certain state of buffer requires more buffers to support,
   * a implementation can return a padding result with unfinished state, and store required
   * padding algorithm state in the padding result, which will be passed to the function next time
   *
   * @param {{finish: boolean}} paddingResult
   * @returns {{finish: boolean}} indicate the padding process is finished over current buffer
   */
  pad(paddingResult) { TODO([this, paddingResult]); }
}

export default Sponge;
