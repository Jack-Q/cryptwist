// gzip format compatible buffer processor
// the gzip format is specified in RFC1952
import { DeflateCompressor } from './deflate';

import { CRC32Checksum } from './gzip-util/crc-32';

const getOperatingSystem = i => ({
  0: 'FAT',
  1: 'Amiga',
  2: 'VMS',
  3: 'Unix',
  4: 'VM/CMS',
  5: 'Atari TOS',
  6: 'HPFS',
  7: 'Macintosh',
  8: 'Z-System',
  9: 'CP/M',
  10: 'TOPS-20',
  11: 'NTFS',
  12: 'QDOS',
  13: 'Acron RISCOS',
  255: 'UNKNOWN',
}[i]);

const parseFlag = f => ({
  text: (f & 0x01) !== 0,
  headerCRC: (f & 0x02) !== 0,
  extra: (f & 0x04) !== 0,
  name: (f & 0x08) !== 0,
  comment: (f & 0x10) !== 0,
});

export class GzipCompressor {
  /**
   * @param {Uint8Array} msg
   */
  static decompress(msg) {
    if (msg.length < 18) {
      throw 'corrupted gzip message';
    }

    let pos = 0;

    // check header magic bit
    if (msg[pos++] !== 0x1f || msg[pos++] !== 0x8b) {
      throw 'the message seems not to be in gzip format';
    }

    const cm = msg[pos++];
    if (cm !== 8) {
      throw 'this implementation only support DEFLATE as compression method';
    }

    const flag = parseFlag(msg[pos++]);

    const modifiedAt = new Date((msg[pos++] | msg[pos++] << 8 | msg[pos++] << 16 | msg[pos++] << 24) * 1000);
    if (modifiedAt.getTime() > 0) {
      console.log(`[GZIP] this message is generated at ${modifiedAt}`);
    }

    const extraFlag = msg[pos++];
    const compressionLevel = extraFlag;

    const os = getOperatingSystem(msg[pos++]);
    console.log(`[GZIP] this message is generated on ${os}`);

    if (flag.extra) {
      const extraLen = msg[pos++] | (msg[pos++] << 8);
      // ignore extra flags in this implementation
      pos += extraLen;
    }

    if (flag.name) {
      const beginPos = pos;
      while (pos < msg.length && msg[pos++] > 0);
      const name = Array.from(msg.slice(beginPos, pos - 1)).map(i => String.fromCharCode(i)).join('');
      console.log(`[GZIP] file name: ${name}`);
    }

    if (flag.comment) {
      const beginPos = pos;
      while (pos < msg.length && msg[pos++] > 0);
      const comment = Array.from(msg.slice(beginPos, pos - 1)).map(i => String.fromCharCode(i)).join('');
      console.log(`[GZIP] file comment: ${comment}`);
    }

    if (flag.headerCRC) {
      const crc = CRC32Checksum.getCRC32(msg, 0, pos);
      const expectedCRC = msg[pos++] | (msg[pos++] << 8);
      if (crc & expectedCRC !== 0xffff) {
        throw 'header CRC check failed, this message might be corrupted';
      }
    }


    const dataSize =
      msg[msg.length - 1] << 24 |
      msg[msg.length - 2] << 16 |
      msg[msg.length - 3] << 8 |
      msg[msg.length - 4];

    const dataChecksum =
      msg[msg.length - 5] << 24 |
      msg[msg.length - 6] << 16 |
      msg[msg.length - 7] << 8 |
      msg[msg.length - 8];

    const data = DeflateCompressor.decompress(msg.slice(pos, -8), { compressionLevel });

    if (data.length !== dataSize) {
      throw 'unexpected length of uncompressed data, the message might be corrupted';
    }

    if (CRC32Checksum.getCRC32(data) !== dataChecksum) {
      console.log(dataChecksum.toString(16));
      console.log(CRC32Checksum.getCRC32(data).toString(16));
      throw 'data checksum mismatch, data might be corrupted';
    }

    return data;
  }

  static compress(msg) {

  }
}

export default GzipCompressor;
