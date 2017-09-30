export const TODO = (that, message = 'this function should be override in subclass') => {
  throw message;
};

export class StreamCipher {
  key;

  get stream() {
    TODO(this);
    return undefined;
  }

  constructor(key) {
    this.key = key;
  }

  encrypt(data) {
    TODO(this);
    return data;
  }

  decrypt(cipher) {
    TODO(this);
    return cipher;
  }
}


const API = {};
export default API;
