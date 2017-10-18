import { Hmac } from './hmac';

import { SHA384Hash } from './sha-384';

const blockLength = 128;
export class HmacSHA384 extends Hmac {

  constructor(key) {
    super(new SHA384Hash(), blockLength, key);
  }

  static hash(data, key) {
    return new HmacSHA384(key).hash(data);
  }
}

export default { HmacSHA384 };
