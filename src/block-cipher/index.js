import { AES128BlockCipher } from './aes-128';
import { AES192BlockCipher } from './aes-192';
import { AES256BlockCipher } from './aes-256';
import { DESBlockCipher } from './des';
import { TripleDESBlockCipher } from './triple-des';
import { IDEABlockCipher } from './idea';

const blockCipherList = [
  AES128BlockCipher,
  AES192BlockCipher,
  AES256BlockCipher,
  DESBlockCipher,
  TripleDESBlockCipher,
  IDEABlockCipher,
];

const getBlockCipher = name => blockCipherList.find(i => i.name === name);

const BlockCipher = {
  AES128BlockCipher,
  AES192BlockCipher,
  AES256BlockCipher,
  DESBlockCipher,
  TripleDESBlockCipher,
  IDEABlockCipher,

  blockCipherList,
  getBlockCipher,
};

export { AES128BlockCipher } from './aes-128';
export { AES192BlockCipher } from './aes-192';
export { AES256BlockCipher } from './aes-256';
export { DESBlockCipher } from './des';
export { TripleDESBlockCipher } from './triple-des';
export { IDEABlockCipher } from './idea';
export { getBlockCipher, blockCipherList, BlockCipher };
export default BlockCipher;
