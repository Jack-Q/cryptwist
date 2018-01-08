export class ECBCipherMode {
  cipher;
  dataBuffer;
  blockSize = 0;

  /**
   * @param {} BlockCipher block cipher class
   * @param {Uint8Array} key encryption key of cipher
   * @param {Uint8Array} iv initialization vector
   */
  constructor(BlockCipher, key, iv = null /* cipherOption = [] */) {
    if (iv !== null && iv.length) {
      console.warn("ECB mode doesn't requires an initialization vector");
    }

    if (iv && iv.length > 0 && iv.length !== BlockCipher.meta.blockSize) {
      throw 'initialization vector should have the same size of the block size of cipher';
    }
    this.BlockCipher = BlockCipher;
    this.blockSize = BlockCipher.meta.blockSize;
    this.cipher = new BlockCipher(key);
  }

  reset() {}
  feedData() { }
  endData() { }

  encrypt(buffer = this.dataBuffer) {
    if (buffer.length % this.blockSize !== 0) {
      throw 'input data is not block aligned';
    }
    const cipher = new Uint8Array(buffer);
    const blockSize = this.blockSize;
    const blockCount = buffer.length / blockSize;
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const cipherBlock = this.cipher.encrypt(buffer.slice(offset, offset + blockSize));
      cipher.set(cipherBlock, offset);
    }
    return cipher;
  }

  decrypt(buffer = this.dataBuffer) {
    if (buffer.length % this.blockSize !== 0) {
      throw 'input data is not block aligned';
    }
    const cipher = new Uint8Array(buffer);
    const blockSize = this.blockSize;
    const blockCount = buffer.length / blockSize;
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const cipherBlock = this.cipher.decrypt(buffer.slice(offset, offset + blockSize));
      cipher.set(cipherBlock, offset);
    }
    return cipher;
  }
}

export default ECBCipherMode;
