import { Hmac } from './hmac';

import { MD5Hash } from './md5';


const blockLength = 64;
export class HmacMD5 extends Hmac {

  static title = 'hmac-md5';

  constructor(key) {
    super(new MD5Hash(), blockLength, key);
  }

  static hash(data, key) {
    return new HmacMD5(key).hash(data);
  }
}


export default { HmacMD5 };
