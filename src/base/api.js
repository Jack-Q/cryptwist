export const TODO = (that, message = '[TODO] this function should be override in subclass') => {
  throw message;
};

export class Hash {
  constructor(...params) { this.init(...params); this.reset(); }

  feedData(data) { return TODO([this, data]); }
  endData(data) { return TODO([this, data]); }

  init() { this.reset(); }
  reset() { return TODO([this]); }

  hash(data) { return TODO([this, data]); }
}

export class BlockCipher {
  key;
  constructor(key) { this.key = key; }
  encrypt(data) { return TODO([this, data]); }
  decrypt(cipher) { return TODO([this, cipher]); }
}

export class BlockCipherMeta {
  /**
   * @param {string} title title of block cipher
   * @param {number} keySize block size in byte
   * @param {number} blockSize block size in byte
   */
  constructor(title, keySize, blockSize) {
    this.title = title;
    this.keySize = keySize;
    this.blockSize = blockSize;
  }
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
