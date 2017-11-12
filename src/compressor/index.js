import { DeflateCompressor } from './deflate';
import { ZlibCompressor } from './zlib';
import { GzipCompressor } from './gzip';

const compressorList = [
  DeflateCompressor,
  ZlibCompressor,
  GzipCompressor,
];

const getCompressor = title => compressorList.find(i => i.title === title);

const Compressor = {
  DeflateCompressor,
  ZlibCompressor,
  GzipCompressor,

  compressorList,
  getCompressor,
};

export { DeflateCompressor } from './deflate';
export { ZlibCompressor } from './zlib';
export { GzipCompressor } from './gzip';
export { getCompressor, compressorList, Compressor };
export default Compressor;

