import { Hmac } from './hmac';

import { SHA224Hash } from './sha-224';

const blockLength = 64;
export class HmacSHA224 extends Hmac {

  static title = 'hmac-sha224';

  constructor(key) {
    super(new SHA224Hash(), blockLength, key);
  }

  static hash(data, key) {
    return new HmacSHA224(key).hash(data);
  }
}

export default { HmacSHA224 };
