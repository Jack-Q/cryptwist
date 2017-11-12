// This script implements the DEFLATE algorithm
import { Inflate } from './deflate-impl/inflate';
import { Deflate, DeflateOption } from './deflate-impl/deflate';

export class DeflateCompressor {
  static title = 'Deflate';

  /**
   * @param {Uint8Array} msg
   */
  static decompress(msg) {
    return Inflate.decompress(msg);
  }

  static compress(msg, opt = DeflateOption.defaultOption) {
    return Deflate.compress(opt, msg);
  }
}

export default DeflateCompressor;
