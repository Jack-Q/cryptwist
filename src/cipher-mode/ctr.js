const bufferAdd = (base, addedValue) => {
  const result = Uint8Array.from(base);
  let carry = 0;
  let leftValue = addedValue;
  for (let i = base.length - 1; i >= 0; i--) {
    const value = result[i] + (leftValue & 0xff) + carry;
    result[i] = value & 0xff;
    leftValue >>>= 8;
    carry = value >>> 8;
    if (carry === 0) break;
  }
  return result;
};

export class CTRCipherMode {
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
      throw 'initialization vector (initial counter value) should have the same size of the block size of cipher';
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
    for (let i = 0; i < blockCount; i++) {
      const offset = blockSize * i;
      const ctrBlock = this.cipher.encrypt(bufferAdd(this.iv, i));
      const plainBlock = buffer.slice(offset, offset + blockSize);
      for (let j = 0; j < plainBlock.length; j++) {
        plainBlock[j] ^= ctrBlock[j];
      }
      cipher.set(plainBlock, offset);
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
      const ctrBlock = this.cipher.encrypt(bufferAdd(this.iv, i));
      const cipherBlock = buffer.slice(offset, offset + blockSize);
      for (let j = 0; j < cipherBlock.length; j++) {
        cipherBlock[j] ^= ctrBlock[j];
      }
      cipher.set(cipherBlock, offset);
    }
    return cipher;
  }
}

export default CTRCipherMode;
