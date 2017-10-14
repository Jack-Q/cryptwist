// This script implements the DEFLATE algorithm
import { reverseBits } from '../util';

export class DeflateCompressor {

  /**
   * @param {Uint8Array} msg
   */
  static decompress(msg) {
    let bytePtr = 0;
    let bitPtr = 0;
    let buffer = new Uint8Array(Math.max(512, 2 * msg.length));
    let bufferPos = 0;

    const expandBuffer = (len = 0) => {
      const newBuffer = new Uint8Array(buffer.length + Math.max(
        len,
        512,
        2 * (msg.length - bytePtr),
      ));
      newBuffer.set(buffer);
      buffer = newBuffer;
    };

    const yieldByte = (b) => {
      if (bufferPos === buffer.length) expandBuffer();
      buffer[bufferPos++] = b;
    };

    const yieldByteArray = (arr, off, len) => {
      if (bufferPos + len >= buffer.length) expandBuffer();
      for (let i = 0; i < len; i += 1) {
        buffer[bufferPos + i] = arr[off + i];
      }
      bufferPos += len;
    };

    const getBit = (i) => {
      if (i > 8) {
        const lo = getBit(8);
        const hi = getBit(i - 8);
        return (hi << 8) | lo;
      }
      const result = ((msg[bytePtr] | (msg[bytePtr + 1] << 8)) >>> bitPtr) & (0xffff >> (16 - i));
      bitPtr += i;
      while (bitPtr >= 8) {
        bitPtr -= 8;
        bytePtr += 1;
      }
      return result;
    };

    const getRBit = i => reverseBits(getBit(i), i);

    const getExtraLen = (len) => {
      const getExtraLenTable = [
        11, 13, 15, 17, 19, 23, 27, 31,
        35, 43, 51, 59, 67, 83, 99, 115,
        131, 163, 195, 227,
      ];
      if (len <= 264) return len - 254;
      if (len === 285) return len;
      const bit = (len - 261) >>> 2;
      return getExtraLenTable[len - 265] + getBit(bit);
    };

    const getDistanceCodeFixedHuffman = () => getRBit(5);

    const getDistance = (code) => {
      const getDistanceTable = [
        5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
        2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577,
      ];
      if (code <= 3) return code + 1;
      const bit = (code >>> 1) - 1;
      return getDistanceTable[code - 4] + getBit(bit);
    };

    // in DEFLATE encoding, the bytes is in least-significant bit first
    const getDByte = () => msg[bytePtr++] | (msg[bytePtr++] << 8);

    const getLitLenFixedHuffman = () => {
      const fix = getRBit(5);
      // 7 bit len, 256 - 279
      if (fix <= 0b00101) return ((fix << 2) | getRBit(2)) + 256;
      // 8 bit len, 0 - 143
      if (fix <= 0b10111) return ((fix << 3) | getRBit(3)) - 48;
      // 8 bit len, 280 - 287
      if (fix <= 0b11000) return getRBit(3);
      // 9 bit len, 144 - 255
      return ((fix << 4) | getRBit(4)) - 256;
    };

    /**
     * @param {Array<number>} table
     */
    const getHuffmanCodeTable = (table) => {
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
        let bits = getRBit(tbl.min);
        for (let i = tbl.min; i <= tbl.max; i++) {
          if (tbl[i]) {
            const letter = tbl[i][bits];
            if (letter !== undefined) return letter;
          }
          bits = (bits << 1) | getBit(1);
        }
        throw 'undefined bit pattern found in decoded Huffman table, stream corruption may occurred';
      };
    };

    const codeLengthDecoderDict = [
      16, 17, 18, 0, 8, 7,
      9, 6, 10, 5, 11, 4,
      12, 3, 13, 2, 14, 1,
      15,
    ];
    const getCodeLengthDecoder = (nCode) => {
      // the encoding length in Huffman schema, use 0 by default indicating the corresponding bit is not used
      const table = Array(codeLengthDecoderDict.length).fill(0);
      for (let i = 0; i < nCode; i += 1) {
        // retrieve the encoded length of code
        table[codeLengthDecoderDict[i]] = getBit(3);
      }
      // Huffman decode of the code length table
      return getHuffmanCodeTable(table);
    };

    const codeLengthDecode = (decoder, size) => {
      const alphabet = Array(size).fill(0);
      for (let j = 0; j < size;) {
        const codeLen = decoder();
        if (codeLen === 17) {
          const l = getBit(3) + 3;
          j += l;
        } else if (codeLen === 16) {
          let l = getBit(2) + 3;
          const prev = alphabet[j - 1];
          while (l--) alphabet[j++] = prev;
        } else if (codeLen === 18) {
          const l = getBit(7) + 11;
          j += l;
        } else {
          alphabet[j++] = codeLen;
        }
      }
      return alphabet;
    };

    const decompressBlock = {
      // no compress
      0: () => {
        // skip current byte
        if (bitPtr > 0) { bitPtr = 0; bytePtr += 1; }
        const len = getDByte();
        const nLen = getDByte();
        if (len !== (0xffff ^ nLen)) {
          throw 'no compression block length mismatch';
        }
        yieldByteArray(msg, bytePtr, len);
        bytePtr += len;
      },
      // fixed Huffman codes
      1: ({ getLitLen, getDistanceCode } = {
        getLitLen: getLitLenFixedHuffman,
        getDistanceCode: getDistanceCodeFixedHuffman,
      }) => {
        while (bytePtr < msg.length) {
          const litLen = getLitLen();
          if (litLen < 256) {
            // literal
            yieldByte(litLen);
          } else if (litLen === 256) {
            // end of block
            break;
          } else {
            // distance
            const len = getExtraLen(litLen);
            const dist = getDistance(getDistanceCode());
            yieldByteArray(buffer, bufferPos - dist, len);
          }
        }
      },
      // dynamic Huffman codes
      2: () => {
        // retrieve dynamic block header
        const nLitLen = getBit(5) + 257;
        const nDist = getBit(5) + 1;
        const nCode = getBit(4) + 4;

        // decompress code length data
        const codeLenDecoder = getCodeLengthDecoder(nCode);
        const unifiedAlphabet = codeLengthDecode(codeLenDecoder, nLitLen + nDist);
        decompressBlock[1]({
          getLitLen: getHuffmanCodeTable(unifiedAlphabet.slice(0, nLitLen)),
          getDistanceCode: getHuffmanCodeTable(unifiedAlphabet.slice(nLitLen)),
        });
      },
      // reserved (error)
      3: () => { throw `reserved block header encountered at ${bytePtr}:${bitPtr}`; },
    };

    while (bytePtr < msg.length) {
      const finalBit = getBit(1);
      const blockType = getBit(2);
      decompressBlock[blockType]();

      if (bytePtr >= msg.length - 1) {
        if (!finalBit) {
          console.warn('incomplete package encountered');
        }
        break;
      }
    }
    return buffer.slice(0, bufferPos);
  }

  static compress(msg) {
    return Uint8Array.from([1, 2, 3, 4]);
  }
}

export default DeflateCompressor;
