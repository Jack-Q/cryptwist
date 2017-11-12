import { Hash } from '../base/api';


const iPadding = 0x36;
const oPadding = 0x5c;

export class Hmac extends Hash {

  static title = 'hmac';

  init(hashInst, blockLength, key) {
    this.key = key;
    this.blockLength = blockLength;
    this.hashInst = hashInst;

    if (this.key.length <= this.blockLength) {
      this.padKey = new Uint8Array(this.blockLength).fill(0);
      this.padKey.set(this.key);
    } else {
      const hashKey = hashInst.hash(this.key);
      this.padKey = new Uint8Array(this.blockLength).fill(0);
      this.padKey.set(hashKey);
    }
    this.clean = true;
  }

  reset() {
    this.clean = true;
    this.hashInst.reset();
  }

  feedData(data) {
    if (data && data.length > 0) {
      if (this.clean) {
        // first section
        this.hashInst.feedData(this.padKey.map(v => v ^ iPadding));
        this.clean = false;
      }
      this.hashInst.feedData(data);
    }
  }

  endData(data) {
    const result = this.hashInst.hash(Uint8Array.of(
      ...this.padKey.map(v => v ^ oPadding),
      ...this.hashInst.endData(data),
    ));
    this.reset();
    return result;
  }

  hash(data) {
    return this.hashInst.hash(Uint8Array.of(
      ...this.padKey.map(v => v ^ oPadding),
      ...this.hashInst.hash(Uint8Array.of(
        ...this.padKey.map(v => v ^ iPadding),
        ...data,
      )),
    ));
  }

  static hash(data, hashInst, blockLength, key) {
    return new Hmac(hashInst, blockLength, key).hash(data);
  }
}


export default { Hmac };
