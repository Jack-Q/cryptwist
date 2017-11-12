export class ECB {
  constructor(blockCipher, key, iv = null /* cipherOption = [] */) {
    if (iv !== null) {
      console.warn("ECB mode doesn't requires an initialization vector");
    }
  }

}

export default ECB;
