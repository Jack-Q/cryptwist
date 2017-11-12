import { Hmac } from './hmac';

import { SHA1Hash } from './sha-1';


const blockLength = 64;
export class HmacSHA1 extends Hmac {

  constructor(key) {
    super(new SHA1Hash(), blockLength, key);
  }

  static hash(data, key) {
    return new HmacSHA1(key).hash(data);
  }
}

export default { HmacSHA1 };
