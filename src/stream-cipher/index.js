import { RC4StreamCipher } from './rc4';

const streamCipherList = [RC4StreamCipher];

const getStreamCipher = name => streamCipherList.find(i => i.name === name);

const StreamCipher = {
  RC4StreamCipher,

  streamCipherList,
  getStreamCipher,
};

export { RC4StreamCipher } from './rc4';
export { streamCipherList, getStreamCipher };

export default StreamCipher;
