import { Hmac } from './hmac';

import { SHA512Hash } from './sha-512';

const blockLength = 128;
export class HmacSHA512 extends Hmac {

  static title = 'hmac-sha512';

  constructor(key) {
    super(new SHA512Hash(), blockLength, key);
  }

  static hash(data, key) {
    return new HmacSHA512(key).hash(data);
  }
}

export default { HmacSHA512 };
