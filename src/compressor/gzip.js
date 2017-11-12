// gzip format compatible buffer processor
// the gzip format is specified in RFC1952
import { DeflateCompressor } from './deflate';

import { AsciiEncoder } from '../encode';

import { CRC32Checksum } from './gzip-util/crc-32';

// GZip is a wrapper format of the DEFLATE algorithm in this implementation
// The structure of GZip format is illustrated as the following diagram
// +---+---+---+---+---+---+---+---+---+---+
// |ID1|ID2|CM |FLG|     M-TIME    |XFL|OS |
// +---+---+---+---+---+---+---+---+---+---+
//
// +---+---+============================+
// | X-LEN | X-LEN bytes of extra field |
// +---+---+============================+
// (if FLG.F-EXTRA set)
//
// +========================================+
// | original file name, terminated by '\0' |
// +========================================+
// (if FLG.F-NAME set)
//
// +==================================+
// | file comment, terminated by '\0' |
// +==================================+
// (if FLG.F-COMMENT set)
//
// +---+---+
// | CRC16 |
// +---+---+
// (if FLG.F-H-CRC set)
//
// +=======================+
// | Compressed Data Block |
// +=======================+
//
// +---+---+---+---+---+---+---+---+
// |     CRC32     |   Input-SIZE  |
// +---+---+---+---+---+---+---+---+
//

const GZIP_ID_1 = 0x1f;
const GZIP_ID_2 = 0x8b;
const GZIP_CM_DEFLATE = 8;

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

  static name = 'gzip';

  /**
   * @param {Uint8Array} msg
   */
  static decompress(msg) {
    if (msg.length < 18) {
      throw 'corrupted gzip message';
    }

    let pos = 0;

    // check header magic bit
    if (msg[pos++] !== GZIP_ID_1 || msg[pos++] !== GZIP_ID_2) {
      throw 'the message seems not to be in gzip format';
    }

    const cm = msg[pos++];
    if (cm !== GZIP_CM_DEFLATE) {
      throw 'this implementation only support DEFLATE as compression method';
    }

    const flag = parseFlag(msg[pos++]);

    const modifiedAt = new Date(
      (msg[pos++] | msg[pos++] << 8 | msg[pos++] << 16 | msg[pos++] << 24)
      * 1000);
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

  static compress(msg, option = { fileName: '', headerCRC: true, comment: '' }) {
    // check option
    const fileName = typeof option.fileName === 'string' && option.fileName.length > 0 ?
      AsciiEncoder.decode(option.name) : [];
    const comment = typeof option.comment === 'string' && option.comment.length > 0 ?
      AsciiEncoder.decode(option.comment) : [];

    // enable by default, unless disabled explicitly
    const isHeaderCRC = fileName.headerCRC === false;

    const compressionData = DeflateCompressor.compress(msg);
    const buffer = new Uint8Array(
      10 + /* header data */
      (fileName.length > 0 ? fileName.length + 1 : 0) + /* file name file (\0 terminated) */
      (comment.length > 0 ? comment.length + 1 : 0) + /* file comment file (\0 terminated) */
      (isHeaderCRC ? 2 : 0) + /* file name file (\0 terminated) */
      compressionData.length + /* compression */
      8, /* tailing data */
    );

    // fill data buffer
    let pos = 0;
    buffer[pos++] = GZIP_ID_1; // ID 1
    buffer[pos++] = GZIP_ID_2; // ID 2
    buffer[pos++] = GZIP_CM_DEFLATE;
    buffer[pos++] = 0 /* text mode */ |
      ((isHeaderCRC ? 1 : 0) << 1) /* header CRC */ |
      (0 << 2) /* extra header */ |
      ((fileName.length > 0 ? 1 : 0) << 3) /* header CRC */ |
      ((comment.length > 0 ? 1 : 0) << 4); /* header CRC */
    const time = Math.floor(Date.now() / 1000);
    buffer[pos++] = time >>> 0;
    buffer[pos++] = time >>> 8;
    buffer[pos++] = time >>> 16;
    buffer[pos++] = time >>> 24;
    buffer[pos++] = 4; // compression level
    buffer[pos++] = 255; // OS neural
    if (fileName.length > 0) {
      buffer.set(fileName, pos);
      pos += fileName.length;
      buffer[pos++] = 0;
    }
    if (comment.length > 0) {
      buffer.set(comment, pos);
      pos += comment.length;
      buffer[pos++] = 0;
    }
    if (isHeaderCRC) {
      const headerCRC = CRC32Checksum.getCRC32(buffer, 0, pos);
      buffer[pos++] = headerCRC & 0xff;
      buffer[pos++] = (headerCRC >> 8) & 0xff;
    }
    buffer.set(compressionData, pos);
    pos += compressionData.length;
    const fileCRC = CRC32Checksum.getCRC32(msg);
    buffer[pos++] = fileCRC & 0xff;
    buffer[pos++] = (fileCRC >>> 8) & 0xff;
    buffer[pos++] = (fileCRC >>> 16) & 0xff;
    buffer[pos++] = (fileCRC >>> 24) & 0xff;
    const size = msg.length;
    buffer[pos++] = size & 0xff;
    buffer[pos++] = (size >>> 8) & 0xff;
    buffer[pos++] = (size >>> 16) & 0xff;
    buffer[pos++] = (size >>> 24) & 0xff;
    console.assert(pos === buffer.length, 'buffer should be filled');
    return buffer;
  }
}

export default GzipCompressor;
