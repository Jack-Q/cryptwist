import { RC4StreamCipher } from './rc4';

const streamCipherList = [RC4StreamCipher];

const getStreamCipher = title => streamCipherList.find(i => i.title === title);

const StreamCipher = {
  RC4StreamCipher,

  streamCipherList,
  getStreamCipher,
};

export { RC4StreamCipher } from './rc4';
export { streamCipherList, getStreamCipher };

export default StreamCipher;
