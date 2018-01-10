export class CBCCipherMode {
  static title = 'Cipher Block Chain (CBC)';
  cipher;
  dataBuffer;
  blockSize = 0;
  iv;

  /**
   * @param {} BlockCipher block cipher class
   * @param {Uint8Array} key encryption key of cipher
   * @param {Uint8Array} iv initialization vector
   */
  constructor(BlockCipher, key, iv /* cipherOption = [] */) {
    if (!iv || iv.length !== BlockCipher.meta.blockSize) {
      throw 'initialization vector should have the same size of the block size of cipher';
    }
    this.BlockCipher = BlockCipher;
    this.blockSize = BlockCipher.meta.blockSize;
    this.cipher = new BlockCipher(key);
    this.iv = Uint8Array.from(iv);
  }

  encrypt(buffer = this.dataBuffer) {
    if (buffer.length % this.blockSize !== 0) {
      throw 'input data is not block aligned';
    }
    const cipher = new Uint8Array(buffer);
    const blockSize = this.blockSize;
    const blockCount = buffer.length / blockSize;
    let lastCipher = this.iv;
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const plainBlock = buffer.slice(offset, offset + blockSize);
      for (let j = 0; j < plainBlock.length; j++) {
        plainBlock[j] ^= lastCipher[j];
      }
      const cipherBlock = this.cipher.encrypt(plainBlock);
      cipher.set(cipherBlock, offset);
      lastCipher = cipherBlock;
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
    let lastCipher = this.iv;
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const cipherBlock = buffer.slice(offset, offset + blockSize);
      const plainBlock = this.cipher.decrypt(cipherBlock);
      for (let j = 0; j < plainBlock.length; j++) {
        plainBlock[j] ^= lastCipher[j];
      }
      cipher.set(plainBlock, offset);
      lastCipher = cipherBlock;
    }
    return cipher;
  }
}

export default CBCCipherMode;
