// convert real distance to internal code
// Extra           Extra               Extra
// Code Bits Dist  Code Bits   Dist     Code Bits Distance
// ---- ---- ----  ---- ----  ------    ---- ---- --------
//   0   0    1     10   4     33-48    20    9   1025-1536
//   1   0    2     11   4     49-64    21    9   1537-2048
//   2   0    3     12   5     65-96    22   10   2049-3072
//   3   0    4     13   5     97-128   23   10   3073-4096
//   4   1   5,6    14   6    129-192   24   11   4097-6144
//   5   1   7,8    15   6    193-256   25   11   6145-8192
//   6   2   9-12   16   7    257-384   26   12  8193-12288
//   7   2  13-16   17   7    385-512   27   12 12289-16384
//   8   3  17-24   18   8    513-768   28   13 16385-24576
//   9   3  25-32   19   8   769-1024   29   13 24577-32768
const getDistCodeTable = [
  0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7,
  8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
  12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
  12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
  13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
  13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
  14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  0, 0, 16, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21,
  22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
  26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
  27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
  27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
  28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
  29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
  29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
  29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
];
const getDistCode = i => getDistCodeTable[
  i < 256 ? (i - 1) : ((i - 1) >>> 7) + 256
];

// convert real length to internal code
// Extra               Extra               Extra
// Code Bits Length(s) Code Bits Lengths   Code Bits Length(s)
// ---- ---- ------     ---- ---- -------   ---- ---- -------
//  257   0     3       267   1   15,16     277   4   67-82
//  258   0     4       268   1   17,18     278   4   83-98
//  259   0     5       269   2   19-22     279   4   99-114
//  260   0     6       270   2   23-26     280   4  115-130
//  261   0     7       271   2   27-30     281   5  131-162
//  262   0     8       272   2   31-34     282   5  163-194
//  263   0     9       273   3   35-42     283   5  195-226
//  264   0    10       274   3   43-50     284   5  227-257
//  265   1  11,12      275   3   51-58     285   0    258
//  266   1  13,14      276   3   59-66
const getLenCodeTable = [
  /* 3 => 257 + 0  = 257 */
  0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11,
  12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17,
  18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19,
  20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
  21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
  22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
  23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
  26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
  27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
  27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28,
  /* 258 => 257 + 28 = 285 */
];
const getLenCode = l => 257 + getLenCodeTable[l - 3];

const BLOCK_TYPE = { OPTIMAL: -1, NO_COMPRESS: 0, STATIC_HUFF: 1, DYNAMIC_HUFF: 2 };
class Block {
  constructor(last, size = 1 << 6, type = BLOCK_TYPE.OPTIMAL) {
    this.last = last;
    this.type = type;
    this.size = size;
    this.litBuf = new Uint8Array(size);
    this.disBuf = new Uint8Array(size);
    this.litLenFreq = Array(286).fill(0);
    this.disFreq = Array(32).fill(0);
    this.pos = 0;
  }
  emitLiteral(lit) {
    this.litLenFreq[lit]++;
    return this.emit(0, lit);
  }

  emitDist(dist, len) {
    this.disBuf[getDistCode(dist)]++;
    this.litLenFreq[getLenCode(len)]++;
    return this.emit(dist, len);
  }
  emit(dist, litLen) {
    this.litBuf[this.pos] = dist;
    this.disBuf[this.pos] = litLen;
    // TODO: block truncate check (whether to stop current block here is profitable)
    return ++this.pos === this.size;
  }
}

/**
 * Straightforward Huffman scan to calculate character frequencies in message
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanHuffman = (ctx, isEnd) => {

};

/**
 * Message scan to apply run-length coding (RLC) to consecutive characters
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanRunBytes = (ctx, isEnd) => {

};

/**
 * Message scan without compression, just copy message to output buffer
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanCopy = (ctx, isEnd) => {
  const { in: msg, out, blockBuf: block } = ctx;
  ctx.ensureResult(msg.usePos - msg.curPos);
};

/**
 * Message scan with historic repetition matching and encoding (excluding lazy matching)
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanMatch = (ctx, isEnd) => {

};

/**
 * Message scan with historic repetition matching and encoding, including lazy matching
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanLazyMatch = (ctx, isEnd) => {

};

export class DeflateOption {
  constructor({ level = 0 } = {}) {
    this.level = level;
  }

  static defaultOption = new DeflateOption();
}

// list of scan policy for raw message process
// the first one is the default
const scanAlgorithmList = {
  copy: messageScanCopy,
  huffman: messageScanHuffman,
  runBytes: messageScanRunBytes,
  match: messageScanMatch,
  lazyMatch: messageScanLazyMatch,
};

export class Deflate {
  constructor(opt = {}) {
    this.opt = opt;
    this.init();
  }

  init() {
    this.in = {
      buf: new Uint8Array(1024),
      readPos: 0, // current position of used message (out of the range of matching)
      curPos: 0, // current processing position of scan algorithm
      usePos: 0, // current occupied buffer
    };
    this.out = {
      buf: new Uint8Array(1024),
      pos: 0,
    };
    this.blockBuf = new Block();
    this.scanMessage = (scanAlgorithmList[this.opt.algorithm] || scanAlgorithmList[0]).bind(this, this);
  }

  endMessage(msg) {
    this.pushMessage(msg, true);
  }

  /**
   *
   * @param {Uint8Array} msg
   * @param {boolean} isEnd
   */
  pushMessage(msg, isEnd = false) {
    let left = msg.length;
    while (left > 0) {
      if (this.in.buf.length === this.in.usePos) {
        // TODO: slide window
        const len = this.in.readPos;
        this.in.buf.set(this.in.buf.slice(len), 0);
        this.in.readPos = 0;
        this.in.curPos -= len;
        this.in.usePos -= len;
      }
      if (left <= this.in.buf.length - this.in.usePos) {
        // the last chunk of message
        this.in.buf.set(msg.slice(-left), this.in.usePos);
        this.in.usePos += left;
        left = 0;
        this.scanMessage(isEnd);
        return;
      }

      const len = this.in.buf.length - this.in.usePos;
      this.in.buf.set(msg.slice(-left, len - left));
      this.in.usePos += len;
      left -= len;
      this.scanMessage(false);
    }
  }

  get result() {
    return this.out.buf.slice(0, this.out.pos);
  }

  static compress(opt, msg) {
    const s = new Deflate(opt);
    s.endMessage(msg);
    return s.result;
  }
}

export default { Deflate, DeflateOption };