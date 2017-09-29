const TODO = (message = 'this function should be override in subclass') => {
  throw message;
};

export class StreamCipher {
  constructor(key) {
    this.key = key;
  }

  encrypt(data) {
    TODO();
    return data;
  }

  decrypt(cipher) {
    TODO();
    return cipher;
  }
}
