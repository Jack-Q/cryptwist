
import { reverseBits } from '../../util';

export class Inflate {
  constructor(msg) {
    this.msg = msg;
    this.bytePtr = 0;
    this.bitPtr = 0;
    this.buffer = new Uint8Array(Math.max(512, 2 * msg.length));
    this.bufferPos = 0;
  }


  expandBuffer(len = 0) {
    const newBuffer = new Uint8Array(this.buffer.length + Math.max(
      len,
      512,
      2 * (this.msg.length - this.bytePtr),
    ));
    newBuffer.set(this.buffer);
    this.buffer = newBuffer;
  }

  yieldByte(b) {
    if (this.bufferPos === this.buffer.length) this.expandBuffer();
    this.buffer[this.bufferPos++] = b;
  }

  yieldByteArray(arr, off, len) {
    const useBuffer = arr === this.buffer;
    if (this.bufferPos + len >= this.buffer.length) this.expandBuffer();
    for (let i = 0; i < len; i += 1) {
      this.buffer[this.bufferPos + i] = (useBuffer ? this.buffer : arr)[off + i];
    }
    this.bufferPos += len;
  }

  getBit(i) {
    console.assert(i < 20, `maximum size of bit to get from input stream is 20, got ${i}`);
    if (i > 8) {
      const lo = this.getBit(8);
      const hi = this.getBit(i - 8);
      return (hi << 8) | lo;
    }
    const result = (
      (this.msg[this.bytePtr] | (this.msg[this.bytePtr + 1] << 8)) >>> this.bitPtr
    ) & (0xffff >> (16 - i));
    this.bitPtr += i;
    while (this.bitPtr >= 8) {
      this.bitPtr -= 8;
      this.bytePtr += 1;
    }
    return result;
  }


  getRBit(i) {
    return reverseBits(this.getBit(i), i);
  }

  getExtraLen(len) {
    const getExtraLenTable = [
      11, 13, 15, 17, 19, 23, 27, 31,
      35, 43, 51, 59, 67, 83, 99, 115,
      131, 163, 195, 227,
    ];
    if (len <= 264) return len - 254;
    if (len === 285) return 258;
    const bit = (len - 261) >>> 2;
    return getExtraLenTable[len - 265] + this.getBit(bit);
  }

  getDistanceCodeFixedHuffman() {
    return this.getRBit(5);
  }

  getDistance = (code) => {
    const getDistanceTable = [
      5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
      2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577,
    ];
    if (code <= 3) return code + 1;
    const bit = (code >>> 1) - 1;
    return getDistanceTable[code - 4] + this.getBit(bit);
  };

  // in DEFLATE encoding, the bytes is in least-significant bit first
  getDByte() {
    return this.msg[this.bytePtr++] | (this.msg[this.bytePtr++] << 8);
  }


  getLitLenFixedHuffman() {
    const fix = this.getRBit(5);
    // 7 bit len, 256 - 279
    if (fix <= 0b00101) return ((fix << 2) | this.getRBit(2)) + 256;
    // 8 bit len, 0 - 143
    if (fix <= 0b10111) return ((fix << 3) | this.getRBit(3)) - 48;
    // 8 bit len, 280 - 287
    if (fix <= 0b11000) return this.getRBit(3) + 280;
    // 9 bit len, 144 - 255
    return ((fix << 4) | this.getRBit(4)) - 256;
  }

  /**
   * @param {Array<number>} table
   */
  getHuffmanCodeTable(table) {
    let max = -Infinity;
    let min = Infinity;
    const count = [];
    for (let i = 0; i < table.length; i += 1) {
      if (table[i] > 0) {
        const val = table[i];
        max = Math.max(max, val);
        min = Math.min(min, val);
        count[val] = (count[val] || 0) + 1;
      }
    }

    const nxtBit = [];
    for (let i = min, c = 0; i <= max; i++) {
      c = (c + (count[i - 1] || 0)) << 1;
      nxtBit[i] = c;
    }

    const tbl = { max, min };
    for (let i = 0; i < table.length; i++) {
      if (table[i] > 0) {
        const val = table[i];
        tbl[val] = (tbl[val] || []);
        tbl[val][nxtBit[val]++] = i;
      }
    }
    return () => {
      if (tbl.min > 20) throw 'input message defines and uses an invalid Huffman tree';
      let bits = this.getRBit(tbl.min);
      for (let i = tbl.min; i <= tbl.max; i++) {
        if (tbl[i]) {
          const letter = tbl[i][bits];
          if (letter !== undefined) return letter;
        }
        bits = (bits << 1) | this.getBit(1);
      }
      throw 'undefined bit pattern found in decoded Huffman table, stream corruption may occurred';
    };
  }

  getCodeLengthDecoder(nCode) {
    const codeLengthDecoderDict = [
      16, 17, 18, 0, 8, 7,
      9, 6, 10, 5, 11, 4,
      12, 3, 13, 2, 14, 1,
      15,
    ];
    // the encoding length in Huffman schema
    // use 0 by default indicating the corresponding bit is not used
    const table = Array(codeLengthDecoderDict.length).fill(0);
    for (let i = 0; i < nCode; i += 1) {
              // retrieve the encoded length of code
      table[codeLengthDecoderDict[i]] = this.getBit(3);
    }
            // Huffman decode of the code length table
    return this.getHuffmanCodeTable(table);
  }


  codeLengthDecode(decoder, size) {
    const alphabet = Array(size).fill(0);
    for (let j = 0; j < size;) {
      const codeLen = decoder();
      if (codeLen === 17) {
        const l = this.getBit(3) + 3;
        j += l;
      } else if (codeLen === 16) {
        let l = this.getBit(2) + 3;
        const prev = alphabet[j - 1];
        while (l--) alphabet[j++] = prev;
      } else if (codeLen === 18) {
        const l = this.getBit(7) + 11;
        j += l;
      } else {
        alphabet[j++] = codeLen;
      }
    }
    return alphabet;
  }

  decompressBlockNoCompress() {
    // skip current byte
    if (this.bitPtr > 0) { this.bitPtr = 0; this.bytePtr += 1; }
    const len = this.getDByte();
    const nLen = this.getDByte();
    if (len !== (0xffff ^ nLen)) {
      throw 'no compression block length mismatch';
    }
    this.yieldByteArray(this.msg, this.bytePtr, len);
    this.bytePtr += len;
  }

  decompressBlockStaticHuffman({ getLitLen, getDistanceCode } = {
    getLitLen: this.getLitLenFixedHuffman.bind(this),
    getDistanceCode: this.getDistanceCodeFixedHuffman.bind(this),
  }) {
    while (this.bytePtr < this.msg.length) {
      const litLen = getLitLen();
      if (litLen < 256) {
        // literal
        this.yieldByte(litLen);
      } else if (litLen === 256) {
        // end of block
        break;
      } else {
        // distance
        const len = this.getExtraLen(litLen);
        const dist = this.getDistance(getDistanceCode());
        this.yieldByteArray(this.buffer, this.bufferPos - dist, len);
      }
    }
  }

  decompressBlockDynamicHuffman() {
    // retrieve dynamic block header
    const nLitLen = this.getBit(5) + 257;
    const nDist = this.getBit(5) + 1;
    const nCode = this.getBit(4) + 4;

    // decompress code length data
    const codeLenDecoder = this.getCodeLengthDecoder(nCode);
    const unifiedAlphabet = this.codeLengthDecode(codeLenDecoder, nLitLen + nDist);
    this.decompressBlockStaticHuffman({
      getLitLen: this.getHuffmanCodeTable(unifiedAlphabet.slice(0, nLitLen)),
      getDistanceCode: this.getHuffmanCodeTable(unifiedAlphabet.slice(nLitLen)),
    });
  }

  decompressBlock(type) {
    switch (type & 0b11) {
      // no compress
      case 0: return this.decompressBlockNoCompress();
      // fixed Huffman codes
      case 1: return this.decompressBlockStaticHuffman();
      // dynamic Huffman codes
      case 2: return this.decompressBlockDynamicHuffman();
      // reserved (error)
      case 3:
      default:
        throw `reserved block header encountered at ${this.bytePtr}:${this.bitPtr}`;
    }
  }

  decompress() {
    while (this.bytePtr < this.msg.length) {
      const finalBit = this.getBit(1);
      const blockType = this.getBit(2);
      this.decompressBlock(blockType);

      if (this.bytePtr >= this.msg.length - 1) {
        if (!finalBit) {
          console.warn('incomplete package encountered');
        }
        break;
      }
    }
    return this.buffer.slice(0, this.bufferPos);
  }

  static decompress(msg) {
    return new Inflate(msg).decompress();
  }
}

export default Inflate;
