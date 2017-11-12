import { Hmac } from './hmac';

import { SHA256Hash } from './sha-256';

const blockLength = 64;
export class HmacSHA256 extends Hmac {

  static name = 'hmac-sha256';

  constructor(key) {
    super(new SHA256Hash(), blockLength, key);
  }

  static hash(data, key) {
    return new HmacSHA256(key).hash(data);
  }
}

export default { HmacSHA256 };
