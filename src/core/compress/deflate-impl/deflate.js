import { reverseBits } from '../../util';

// minimal length of repetition to be encoded
const MIN_ENCODE_LEN = 3;
// maximal length of repetition to be encoded
const MAX_ENCODE_LEN = 258;

class InputBuffer {
  constructor() {
    this.buf = new Uint8Array(1 << (10 + 6));
    this.readPos = 0; // current position of used message (out of the range of matching)
    this.curPos = 0; // current processing position of scan algorithm
    this.usePos = 0; // current occupied buffer
  }
}

class OutputBuffer {
  constructor(size) {
    this.buf = new Uint8Array(size);
    this.bytePos = 0;
    this.bitPos = 0;
  }

  ensureResult(len) {
    if (this.buf.length - this.bytePos < len) {
      const buf = new Uint8Array(this.buf.length + Math.max(len * 2, 1024 * 10));
      buf.set(this.buf);
      this.buf = buf;
    }
  }

  putRBits(bits, len) {
    this.putBits(reverseBits(bits, len), len);
  }

  putBits(bits, len) {
    this.ensureResult(Math.ceil((len + 8 - this.bitPos) / 8));
    let pos = 0;
    // fill current unfilled byte
    if (this.bitPos && this.bitPos + len > 8) {
      this.buf[this.bytePos] &= ~(0xff << this.bitPos);
      this.buf[this.bytePos] |= bits << this.bitPos;
      pos += 8 - this.bitPos;
      this.bitPos = 0;
      this.bytePos++;
    }
    // copy whole bytes
    while (len - pos > 8) {
      this.putByte(bits >> pos);
      pos += 8;
    }
    // fill tailing bits
    if (pos < len && this.bitPos + len - pos <= 8) {
      this.buf[this.bytePos] &= ~(0xff << this.bitPos);
      this.buf[this.bytePos] |= (bits >> pos) << this.bitPos;
      this.bitPos += len - pos;
      if (this.bitPos === 8) {
        this.bitPos = 0;
        this.bytePos++;
      }
    }
  }
  putByte(byte) {
    console.assert(this.bitPos === 0, 'bit pos of output buffer should be 0');
    console.assert(this.bytePos < this.buf.length, 'buffer space should be ensured');
    this.buf[this.bytePos++] = byte;
  }
  putBytes(buf, off = 0, len = buf.length - off) {
    console.assert(this.bitPos === 0, 'bit pos of output buffer should be 0');
    this.ensureResult(len);
    this.buf.set(buf.slice(off, off + len), this.bytePos);
    this.bytePos += len;
  }
}


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
const getDistExtraBitTable = [
  [1, 0], [2, 0], [3, 0], [4, 0], [5, 1],
  [7, 1], [9, 2], [13, 2], [17, 3], [25, 3],
  [33, 4], [49, 4], [65, 5], [97, 5], [129, 6],
  [193, 6], [257, 7], [385, 7], [513, 8], [769, 8],
  [1025, 9], [1537, 9], [2049, 10], [3073, 10], [4097, 11],
  [6145, 11], [8193, 12], [12289, 12], [16385, 13], [24577, 13],
  [0, 0], [0, 0], // the last two dist-code is not used
].map(i => ({ len: i[1], base: i[0] }));
const getDistExtraBit = code => getDistExtraBitTable[code];

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
const isLenCode = code => code >= 257 && code <= 285;
const getLenCode = l => 257 + getLenCodeTable[l - 3];
const getLenExtraBitTable = [
  [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
  [8, 0], [9, 0], [10, 0], [11, 1], [13, 1],
  [15, 1], [17, 1], [19, 2], [23, 2], [27, 2],
  [31, 2], [35, 3], [43, 3], [51, 3], [59, 3],
  [67, 4], [83, 4], [99, 4], [115, 4], [131, 5],
  [163, 5], [195, 5], [227, 5], [258, 0],
].map(i => ({ len: i[1], base: i[0] }));
const getLenExtraBit = lenCode => getLenExtraBitTable[lenCode - 257];

// Lit Value    Bits    Codes
// ---------    ----    -----
//   0 - 143     8      00110000  through 10111111
// 144 - 255     9      110010000 through 111111111
// 256 - 279     7      0000000   through 0010111
// 280 - 287     8      11000000  through 11000111
const getStaticHuffLitLenBit = (code) => {
  if (code >= 256 && code <= 279) return [code - 256, 7];
  if (code <= 143 && code >= 0) return [0b00110000 + code, 8];
  if (code >= 280 && code <= 287) return [0b11000000 + code - 280, 8];
  if (code >= 144 && code <= 255) return [0b110010000 + code - 144, 9];
  return [0, 0];
};

const constHuffmanTree = (nodes) => {
  const tree = Array.from(nodes.filter(e => e.freq > 0));

  if (tree.length === 0) return 0;

  const maxLit = tree[tree.length - 1].lit + 1;
  if (tree.length === 1) {
    tree[0].len = 1;
    tree[0].code = 0;
    return maxLit;
  }

  // construct tree
  while (tree.length > 1) {
    tree.sort((i, j) => i.freq - j.freq);
    const a = tree.shift();
    const b = tree.shift();
    tree.push({ freq: a.freq + b.freq, a, b });
  }
  // traverse tree
  const count = [];
  let max = -Infinity;
  let min = Infinity;
  const tr = (t, l) => {
    if (t.lit === undefined) {
      tr(t.a, l + 1);
      tr(t.b, l + 1);
    } else {
      t.len = l;
      count[l] = (count[l] || 0) + 1;
      max = Math.max(max, l);
      min = Math.min(min, l);
    }
  };
  tr(tree[0], 0);

  const nxtBit = [];
  for (let i = min, c = 0; i <= max; i++) {
    c = (c + (count[i - 1] || 0)) << 1;
    nxtBit[i] = c;
  }

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].freq > 0) {
      nodes[i].code = nxtBit[nodes[i].len]++;
    }
  }
  return maxLit;
};

const encodeCodeLengthDictOrder = [
  16, 17, 18, 0, 8, 7,
  9, 6, 10, 5, 11, 4,
  12, 3, 13, 2, 14, 1,
  15,
];

/**
 * Encode literal-length dictionary and distance dictionary
 *
 * 0 - 15: Represent code lengths of 0 - 15
 *  16: Copy the previous code length 3 - 6 times.
 *      The next 2 bits indicate repeat length
 *            (0 = 3, ... , 3 = 6)
 *         Example:  Codes 8, 16 (+2 bits 11),
 *                   16 (+2 bits 10) will expand to
 *                   12 code lengths of 8 (1 + 6 + 5)
 *  17: Repeat a code length of 0 for 3 - 10 times.
 *      (3 bits of length)
 *  18: Repeat a code length of 0 for 11 - 138 times
 *      (7 bits of length)
 *
 * Code length alphabet in order
 *  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
 *
 * @param {Array<{len: number}>} nodes
 */
const encodeCodeLength = (nodes) => {
  const litLenDisDict = [];
  const codeFreq = Array(encodeCodeLengthDictOrder.length).fill(0);
  const freq = f => codeFreq[f]++;
  const len = i => (nodes[i] && nodes[i].len >= 0 ? nodes[i].len : -1);
  for (let i = 0; i < nodes.length; i++) {
    if (len(i) > 0) {
      const v = len(i);
      console.assert(v > 0 && v <= 15, `${v}should in (0, 15]`);
      litLenDisDict.push(v);
      freq(v);
      // repeat for 3 or longer times
      if (len(i + 1) === v && len(i + 2) === v && len(i + 3) === v) {
        let r = 3;
        while (len(i + r + 1) === v) r++;
        let l = r;
        while (l > 6) { litLenDisDict.push(16, [2, 0b11]); freq(16); l -= 6; }
        if (l > 3) { litLenDisDict.push(16, [2, l - 3]); freq(16); l = 0; }
        while (l > 0) { litLenDisDict.push(v); freq(v); l--; }
        i += r;
      }
    } else if (len(i) === 0) {
      let r = 1;
      while (len(i + r) === 0) r++;
      let l = r;
      while (l >= 138) { litLenDisDict.push(18, [7, 138 - 11]); freq(18); l -= 138; }
      if (l >= 11) { litLenDisDict.push(18, [7, l - 11]); freq(18); l = 0; }
      if (l >= 3) { litLenDisDict.push(17, [3, l - 3]); freq(17); l = 0; }
      while (l > 0) { litLenDisDict.push(0); freq(0); l--; }
      i += r - 1;
    }
  }

  const codeHuffmanCode = codeFreq.map((f, i) => ({ lit: i, freq: f, len: 0 }));
  constHuffmanTree(codeHuffmanCode);
  let codeSize = encodeCodeLengthDictOrder.length;
  while (codeHuffmanCode[encodeCodeLengthDictOrder[codeSize - 1]].len > 0) codeSize--;
  const codeCost = codeSize * 3 + litLenDisDict.reduce((c, v) =>
    c + (v.length ? v[1] : codeHuffmanCode[v].len), 0);
  return { codeSize, codeCost, codeHuffmanCode, litLenDisDict };
};

const BLOCK_TYPE = { OPTIMAL: -1, NO_COMPRESS: 0, STATIC_HUFF: 1, DYNAMIC_HUFF: 2 };
class Block {
  constructor(size = 1 << 6, type = BLOCK_TYPE.OPTIMAL) {
    this.type = type;
    this.size = size;
    this.litBuf = Array(size);
    this.disBuf = Array(size);
    this.litLenFreq = Array(286).fill(0);
    this.disFreq = Array(32).fill(0);
    this.pos = 0;
    this.msgSize = 0;
  }
  emitLiteral(lit) {
    this.litLenFreq[lit]++;
    this.msgSize++;
    return this.emit(0, lit);
  }

  emitDist(dist, len) {
    this.disFreq[getDistCode(dist)]++;
    this.litLenFreq[getLenCode(len)]++;
    this.msgSize += len;
    return this.emit(dist, len);
  }
  emit(dist, litLen) {
    this.litBuf[this.pos] = litLen;
    this.disBuf[this.pos] = dist;
    // TODO: block truncate check (whether to stop current block here is profitable)
    return ++this.pos === this.size;
  }

  dynamicHuffmanEncode() {
    if (this.dynamicHuffmanEncodeStatus) return;
    const litLenNodes = this.litLenFreq.map((i, n) => ({ lit: n, freq: i, len: 0 }));
    const litLenSize = constHuffmanTree(litLenNodes);
    const disNodes = this.disFreq.map((i, n) => ({ lit: n, freq: i, len: 0 }));
    const disSize = constHuffmanTree(disNodes);
    const { codeSize, codeCost, codeHuffmanCode, litLenDisDict } = encodeCodeLength([
      ...litLenNodes.slice(0, litLenSize),
      ...(disSize === 0 ? [{ len: 1 }] : disNodes.slice(0, disSize)),
    ]);
    const cost = Math.ceil((this.disFreq.reduce((c, f, i) =>
        c + f * (disNodes[i].len + getDistExtraBit(i).len), 0) +
      this.litLenFreq.reduce((c, f, i) =>
        c + f * (litLenNodes[i].len + (isLenCode(i) ? getLenExtraBit(i).len : 0)), 0) +
      codeCost +
      5 /* litSize */ + 5  /* distSize */ + 4 /* codeSize */
      + 3 /* block header */ + 7 /* incomplete byte overhead */
    ) / 8);
    this.dynamicHuffmanEncodeStatus = {
      cost,
      codeSize,
      litLenSize,
      disSize: disSize === 0 ? 1 : disSize,
      codeHuffmanCode,
      litLenDisDict,
      litLenNodes,
      disNodes,
    };
  }

  encodeBlock(out, msg, isEnd) {
    // put end of block literal to freq stat
    this.litLenFreq[256]++;

    let encoding = this.type;
    if (encoding === BLOCK_TYPE.OPTIMAL) {
      const plainCost = this.costBoundBlockPlain();
      const staticCost = this.costBoundStaticHuff();
      encoding = plainCost <= staticCost ? BLOCK_TYPE.NO_COMPRESS : BLOCK_TYPE.STATIC_HUFF;

      // for short chunk of message, the overhead of dict is too high using dynamic Huff
      if (this.pos > 128) {
        this.dynamicHuffmanEncode();
        const dynamicCost = this.costBoundDynamicHuff();
        encoding = dynamicCost < (encoding === BLOCK_TYPE.NO_COMPRESS ? plainCost : staticCost) ?
          BLOCK_TYPE.DYNAMIC_HUFF : encoding;
      }

      console.log(`select ${['plain', 'static', 'dynamic'][encoding]} encoding for current block`);
    }
    switch (encoding) {
      case BLOCK_TYPE.STATIC_HUFF:
        this.encodingBlockStaticHuffman(out, msg, isEnd);
        break;
      case BLOCK_TYPE.DYNAMIC_HUFF:
        this.dynamicHuffmanEncode();
        this.encodingBlockDynamicHuffman(out, msg, isEnd);
        break;
      case BLOCK_TYPE.NO_COMPRESS:
      default:
        this.encodeBlockPlain(out, msg, isEnd);
    }
  }
  reset() {
    this.litLenFreq.fill(0);
    this.disFreq.fill(0);
    this.pos = 0;
    this.msgSize = 0;
    this.dynamicHuffmanEncodeStatus = null;
  }

  /**
   * calculate cost to encode message block in plain message
   */
  costBoundBlockPlain() { return this.message + 4 + 2; }

  /**
   * @param {OutputBuffer} out
   * @param {InputBuffer} msg
   * @param {boolean} isEnd
   */
  encodeBlockPlain(out, msg, isEnd) {
    out.ensureResult(this.costBoundBlockPlain());
    out.putBits(0b000 | (isEnd ? 1 : 0), 3);
    if (out.bitPos !== 0) { out.bitPos = 0; out.bytePos++; }
    const len = this.msgSize;
    out.putByte(len); out.putByte(len >>> 8); // length
    out.putByte(~len); out.putByte((~len) >>> 8); // 1's complement of len
    out.putBytes(msg.buf, msg.curPos - len, len);
    this.reset();
  }

  costBoundStaticHuff() {
    return Math.ceil((this.disFreq.reduce((cost, freq, index) =>
      cost + freq * (5 + getDistExtraBit(index).len), 0) +
      this.litLenFreq.reduce((cost, freq, index) =>
        cost + freq * (getStaticHuffLitLenBit(index)[1] +
          (isLenCode(index) ? getLenExtraBit(index).len : 0))
        , 0) + 3 /* block header */ + 7 /* incomplete byte overhead */) / 8);
  }

  /**
   * @param {OutputBuffer} out
   * @param {InputBuffer} msg
   * @param {boolean} isEnd
   */
  encodingBlockStaticHuffman(out, msg, isEnd) {
    out.ensureResult(this.costBoundStaticHuff());
    out.putBits(0b010 | (isEnd ? 1 : 0), 3);
    for (let i = 0; i < this.pos; i++) {
      if (this.disBuf[i] > 0) {
        // len
        const len = this.litBuf[i];
        const lenCode = getLenCode(len);
        out.putRBits(...getStaticHuffLitLenBit(lenCode));
        const lenExtra = getLenExtraBit(lenCode);
        if (lenExtra.len > 0) {
          out.putBits(len - lenExtra.base, lenExtra.len);
        }
        // dist
        const dist = this.disBuf[i];
        const distCode = getDistCode(dist);
        out.putRBits(distCode, 5); // fixed for static huffman
        const distExtra = getDistExtraBit(distCode);
        out.putBits(dist - distExtra.base, distExtra.len);
      } else {
        // literal
        out.putRBits(...getStaticHuffLitLenBit(this.litBuf[i]));
      }
    }
    out.putRBits(...getStaticHuffLitLenBit(256));
    this.reset();
  }

  costBoundDynamicHuff() {
    this.dynamicHuffmanEncode();
    return this.dynamicHuffmanEncodeStatus.cost;
  }

  /**
   * @param {OutputBuffer} out
   * @param {InputBuffer} msg
   * @param {boolean} isEnd
   */
  encodingBlockDynamicHuffman(out, msg, isEnd) {
    const {
      cost,
      codeSize,
      litLenSize,
      disSize,
      codeHuffmanCode,
      litLenDisDict,
      litLenNodes,
      disNodes,
    } = this.dynamicHuffmanEncodeStatus;

    const getLitLenBit = (code) => {
      const c = litLenNodes[code];
      return [c.code, c.len];
    };

    const getDistBit = (code) => {
      const c = disNodes[code];
      return [c.code, c.len];
    };

    out.ensureResult(cost);
    out.putBits(0b100 | (isEnd ? 1 : 0), 3);
    out.putBits(Math.max(litLenSize - 257, 0), 5);
    out.putBits(Math.max(disSize - 1, 0), 5);
    out.putBits(Math.max(codeSize - 4, 0), 4);
    for (let i = 0; i < codeSize; i++) {
      out.putBits(codeHuffmanCode[encodeCodeLengthDictOrder[i]].len, 3);
    }
    for (let i = 0; i < litLenDisDict.length; i++) {
      const v = litLenDisDict[i];
      if (v.length) {
        out.putBits(v[1], v[0]);
      } else {
        const huffCode = codeHuffmanCode[v];
        out.putRBits(huffCode.code, huffCode.len);
      }
    }
    for (let i = 0; i < this.pos; i++) {
      if (this.disBuf[i] > 0) {
        // len
        const len = this.litBuf[i];
        const lenCode = getLenCode(len);
        out.putRBits(...getLitLenBit(lenCode));
        const lenExtra = getLenExtraBit(lenCode);
        if (lenExtra.len > 0) {
          out.putBits(len - lenExtra.base, lenExtra.len);
        }
        // dist
        const dist = this.disBuf[i];
        const distCode = getDistCode(dist);
        out.putRBits(...getDistBit(distCode)); // fixed for static huffman
        const distExtra = getDistExtraBit(distCode);
        out.putBits(dist - distExtra.base, distExtra.len);
      } else {
        // literal
        out.putRBits(...getLitLenBit(this.litBuf[i]));
      }
    }
    out.putRBits(...getLitLenBit(256));
    this.reset();
  }

  get full() { return this.pos === this.size; }
}

/**
 * Straightforward Huffman scan to calculate character frequencies in message
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanHuffman = (ctx, isEnd) => {
  const { in: msg, out, blockBuf: block } = ctx;
  while (msg.curPos < msg.usePos) {
    while (msg.curPos < msg.usePos && !block.emitLiteral(msg.buf[msg.curPos++]));
    if (block.full) {
      block.encodeBlock(out, msg, msg.curPos === msg.usePos ? isEnd : false);
      msg.readPos = msg.curPos;
    }
    if (msg.curPos === msg.usePos && isEnd) {
      block.encodeBlock(out, msg, true);
      msg.readPos = msg.curPos;
    }
  }
};

/**
 * Message scan to apply run-length coding (RLC) to consecutive characters
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanRunBytes = (ctx, isEnd) => {
  const { in: msg, out, blockBuf: block } = ctx;
  while (msg.curPos < msg.usePos) {
    const lastCh = msg.buf[msg.curPos - 1];
    if (msg.buf[msg.curPos] !== lastCh) {
      // no repetition
      block.emitLiteral(msg.buf[msg.curPos++]);
    } else {
      const maxPos = Math.min(msg.curPos + MAX_ENCODE_LEN, msg.usePos);
      let pos = msg.curPos + 1;
      while (pos < maxPos && msg.buf[pos] === lastCh) pos++;

      // if (pos === msg.usePos && !isEnd) {

      // } else
      if (pos - msg.curPos >= MIN_ENCODE_LEN) {
        block.emitDist(1, pos - msg.curPos);
        msg.curPos = pos;
      } else {
        while (msg.curPos < pos && !block.emitLiteral(lastCh)) msg.curPos++;
      }
    }

    if (block.full) {
      block.encodeBlock(out, msg, msg.curPos === msg.usePos ? isEnd : false);
      msg.readPos = msg.curPos - 1;
    }

    if (msg.curPos === msg.usePos && isEnd) {
      block.encodeBlock(out, msg, true);
      msg.readPos = msg.curPos - 1;
    }

    if (msg.curPos === msg.usePos &&
      msg.usePos === msg.buf.length &&
      msg.readPos < 0.1 * msg.buf.length) {
      block.encodeBlock(out, msg, isEnd);
      msg.readPos = msg.curPos - 1;
    }
  }
};

/**
 * Message scan without compression, just copy message to output buffer
 *
 * In this mode, the block buffer is always not used (no hash table is maintained)
 * @argument {Deflate} ctx
 * @argument {boolean} isEnd
 */
const messageScanCopy = (ctx, isEnd) => {
  const { in: msg, out } = ctx;
  out.ensureResult(msg.usePos - msg.curPos + 6);
  // since message is copied into ``in'' buffer first,
  // the length of msg can always satisfied to the constraint of block length
  if (isEnd || msg.usePos - msg.curPos >= msg.buf.length / 2) {
    out.putBits(0b000 | (isEnd ? 1 : 0), 3);
    if (out.bitPos !== 0) { out.bitPos = 0; out.bytePos++; }

    const len = msg.usePos - msg.curPos;
    out.putByte(len); out.putByte(len >>> 8); // length
    out.putByte(~len); out.putByte((~len) >>> 8); // 1's complement of len
    out.putBytes(msg.buf, msg.curPos, len);

    msg.curPos = msg.usePos;
    msg.readPos = msg.usePos;
  }
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

const encodeBlockMode = {
  optimal: BLOCK_TYPE.OPTIMAL,
  forceNoCompress: BLOCK_TYPE.NO_COMPRESS,
  forceStaticHuff: BLOCK_TYPE.STATIC_HUFF,
  forceDynamicHuff: BLOCK_TYPE.DYNAMIC_HUFF,
};

export class Deflate {
  constructor(opt = {}) {
    this.opt = opt;
    this.init();
  }

  init() {
    const bufferSize = 1 << (10 + 5);
    this.in = new InputBuffer(bufferSize << 1);
    this.out = new OutputBuffer(bufferSize << 1);
    this.encodeBlockMode =
      encodeBlockMode[this.opt.encode] || BLOCK_TYPE.OPTIMAL;
    this.blockBuf = new Block(bufferSize, this.encodeBlockMode);
    this.scanMessage = (
      scanAlgorithmList[this.opt.algorithm] ||
      scanAlgorithmList[Object.keys(scanAlgorithmList)[0]]
    ).bind(this, this);
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
        console.assert(this.in.readPos > 0, 'a buffer should be cleaned');
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
    return this.out.buf.slice(0, this.out.bytePos + (this.out.bitPos > 0 ? 1 : 0));
  }

  static compress(opt, msg) {
    const s = new Deflate(opt);
    s.endMessage(msg);
    const result = s.result;
    // console.log(result);
    return result;
  }
}

export default { Deflate, DeflateOption };
