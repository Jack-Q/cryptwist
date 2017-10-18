import { Hash } from '../base/api';

import { MD5Hash } from './md5';


const blockLength = 64;
const iPadding = new Uint8Array(blockLength).fill(0x36);
const oPadding = new Uint8Array(blockLength).fill(0x5c);
export class HmacMD5 extends Hash {

  init(key) {
    this.key = key;
    if (this.key.length <= blockLength) {
      this.padKey = new Uint8Array(blockLength).fill(0);
      this.padKey.set(this.key);
    } else {
      this.padKey = MD5Hash.hash(this.key);
    }
    this.buffer = new Uint8Array(0);
  }

  reset() {
    this.buffer = new Uint8Array(0);
  }

  feedData(data) {
    if (data && data.length > 0) {
      this.buffer = Uint8Array.of(...this.buffer, ...data);
    }
  }

  endData(data) {
    this.feedData(data);
    return MD5Hash.hash(Uint8Array.of(
      ...this.padKey.map((v, i) => v ^ oPadding[i]),
      ...MD5Hash.hash(Uint8Array.of(
        ...this.padKey.map((v, i) => v ^ iPadding[i]),
        ...this.buffer,
      )),
    ));
  }

  hash(data) {
    if (this.buffer.length === 0) {
      return this.endData(data);
    }

    return HmacMD5.hash(data, this.key);
  }

  static hash(data, key) {
    return new HmacMD5(key).hash(data);
  }
}


export default { HmacMD5 };
