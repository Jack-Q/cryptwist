export class OFBCipherMode {
  static title = 'Output Feedback (OFB)';
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
    let lastBlock = this.iv;
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const outputBlock = this.cipher.encrypt(lastBlock);
      const plainBlock = buffer.slice(offset, offset + blockSize);
      for (let j = 0; j < plainBlock.length; j++) {
        plainBlock[j] ^= outputBlock[j];
      }
      cipher.set(plainBlock, offset);
      lastBlock = outputBlock;
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
    let lastBlock = this.iv;
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const outputBlock = this.cipher.encrypt(lastBlock);
      const cipherBlock = buffer.slice(offset, offset + blockSize);
      for (let j = 0; j < cipherBlock.length; j++) {
        cipherBlock[j] ^= outputBlock[j];
      }
      cipher.set(cipherBlock, offset);
      lastBlock = outputBlock;
    }
    return cipher;
  }
}

export default OFBCipherMode;
