// zlib format compatible buffer processor
// the zlib format is specified in RFC1950
import { DeflateCompressor } from './deflate';
import { Adler32Checksum } from './zlib-util/edler';

export class ZlibCompressor {
  /**
   * @param {Uint8Array} msg
   */
  static decompress(msg) {
    if (msg.length < 6) {
      throw 'corrupted zlib message';
    }
    const cmf = msg[0];
    const flg = msg[1];

    // Header checksum
    if ((flg + cmf * 256) % 31 !== 0) throw 'zlib header check failed, buffer content might be corrupted';

    // Check compression method
    const cm = cmf & 0x0f;
    if (cm !== 8) throw 'this implementation only support DEFLATE compression method';

    // for DEFLATE, the compression info indicates the window size (in base-2 logarithm)
    const compressionInfo = cmf >>> 4;
    if (compressionInfo > 7) throw 'window info size larger than 32K is not supported';

    const dictFlag = (flg >>> 5) & 1;

    const compressionLevel = (flg >>> 6) & 3;
    const dict = { length: 0 };
    if (dictFlag) {
      const dictChecksum = msg[2] << 24 | msg[3] << 16 | msg[4] << 8 | msg[5];
      let pos = 5;
      for (let chk = new Adler32Checksum(); pos < msg.length && chk.adler !== dictChecksum; pos++) {
        chk.update(msg, pos, 1);
      }
      dict.dict = msg.slice(6, pos);
      dict.length = pos - 2;
    }

    const dataChecksum =
      msg[msg.length - 4] << 24 |
      msg[msg.length - 3] << 16 |
      msg[msg.length - 2] << 8 |
      msg[msg.length - 1];

    const data = DeflateCompressor.decompress(msg.slice(2 + dict.length, -4), {
      dict: dict.buffer,
      compressionLevel,
    });
    if (Adler32Checksum.getCheck(data) !== dataChecksum) {
      console.log(Adler32Checksum.getCheck(data));
      console.log(dataChecksum);
      throw `data checksum mismatch, data might be corrupted ${dataChecksum.toString(16)} ${Adler32Checksum.getCheck(data).toString(16)}`;
    }

    return data;
  }

  static compress(msg) {

  }
}

export default ZlibCompressor;
