export const TODO = (that, message = '[TODO] this function should be override in subclass') => {
  throw message;
};

export class Hash {
  constructor() { this.init(); this.reset(); }

  feedData(data) { return TODO([this, data]); }
  endData(data) { return TODO([this, data]); }

  init() { this.reset(); }
  reset() { return TODO([this]); }

  hash(data) { return TODO([this, data]); }
}

export class BlockCipher {
  key;
  encrypt(data) { return TODO([this, data]); }
  decrypt(cipher) { return TODO([this, cipher]); }
}

export class StreamCipher {
  key;

  /**
   * @returns {Generator<number>}
   */
  get stream() {
    return TODO(this);
  }

  constructor(key) {
    this.key = key;
  }

  /**
   * @param {Uint8Array} data
   * @returns {Uint8Array} encrypted message
   */
  encrypt(data) { return TODO([this, data]); }

  /**
   * @param {Uint8Array} cipher
   * @returns {Uint8Array} decrypted message
   */
  decrypt(cipher) { return TODO([this, cipher]); }
}

const API = {};
export default API;
