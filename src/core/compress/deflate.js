// This script implements the DEFLATE algorithm

const reverseBitMap = [
  0b0000, 0b1000, 0b0100, 0b1100, 0b0010, 0b1010, 0b0110, 0b1110,
  0b0001, 0b1001, 0b0101, 0b1101, 0b0011, 0b1011, 0b0111, 0b1111,
];
const reverseBits = (i, len) => {
  if (len < 5) return reverseBitMap[i & 7] >>> (4 - len);
  return ((reverseBitMap[i & 0xf] << 4) | reverseBitMap[(i >>> 4) & 0xf]) >>> (8 - len);
};

export class Deflate {

  /**
   *
   * @param {Uint8Array} msg
   */
  static decompress(msg) {
    let bytePtr = 0;
    let bitPtr = 0;
    let buffer = new Uint8Array(Math.max(512, 2 * msg.length));
    let bufferPos = 0;

    const expandBuffer = (len = 0) => {
      const newBuffer = new Uint8Array(buffer.length + Math.max(len, 512, 2 * (msg.length - bytePtr)));
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
      if (i + bitPtr <= 8) {

      }
      const result = ((msg[bytePtr] | (msg[bytePtr + 1] << 8)) >>> bitPtr) & (0xffff >> (16 - i));
      bitPtr += i;
      while (bitPtr >= 8) {
        bitPtr -= 8;
        bytePtr += 1;
      }
      return result;
    };

    const getExtraLenTable = [
      11, 13, 15, 17, 19, 23, 27, 31,
      35, 43, 51, 59, 67, 83, 99, 115,
      131, 163, 195, 227,
    ];
    const getExtraLen = (len) => {
      if (len <= 264) return len - 254;
      if (len === 285) return len;
      const bit = (len - 261) >>> 2;
      return getExtraLenTable[len - 265] + getBit(bit);
    };

    const getDistanceTable = [
      5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
      2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577,
    ];
    const getDistance = () => {
      const code = reverseBits(getBit(5), 5);
      if (code <= 3) return code + 1;
      const bit = (code >>> 1) - 1;
      return getDistanceTable[code - 4] + getBit(bit);
    };

    // in DEFLATE encoding, the bytes is in least-significant bit first
    const getDByte = () => msg[bytePtr++] | (msg[bytePtr++] << 8);

    const getLetterFixedHuffmanAlphabet = () => {
      const fix = reverseBits(getBit(5), 5);
      // 7 bit len, 256 - 279
      if (fix <= 0b00101) return ((fix << 2) | reverseBits(getBit(2), 2)) + 256;
      // 8 bit len, 0 - 143
      if (fix <= 0b10111) return ((fix << 3) | reverseBits(getBit(3), 3)) - 48;
      // 8 bit len, 280 - 287
      if (fix <= 0b11000) return reverseBits(getBit(3), 3);
      // 9 bit len, 144 - 255
      return ((fix << 4) | reverseBits(getBit(4), 4)) - 256;
    };

    const decompressBlock = {
      // no compress
      0: () => {
        console.log('no compression');
        // skip current byte
        if (bitPtr > 0) { bitPtr = 0; bytePtr += 1; }
        const len = getDByte();
        const nLen = getDByte();
        console.log('block length', len, nLen);
        // console.log(msg.slice(bytePtr, bytePtr + len));
        bytePtr += len;
      },
      // fixed Huffman codes
      1: () => {
        console.log('fixed Huffman block');
        while (bytePtr < msg.length) {
          const litLen = getLetterFixedHuffmanAlphabet();
          if (litLen < 256) {
            // literal
            yieldByte(litLen);
          } else if (litLen === 256) {
            // end of block
            break;
          } else {
            // distance
            const len = getExtraLen(litLen);
            const dist = getDistance();
            console.log(litLen);
            console.log(len, dist);
            yieldByteArray(buffer, bufferPos - dist, len);
          }
        }
      },
      // dynamic Huffman codes
      2: () => {
        console.log('dynamic Huffman block');
        // retrieve dynamic block header
        const nLitLen = getBit(5) + 257;
        const nDist = getBit(5) + 1;
        const nCode = getBit(4) + 4;
        console.log(nLitLen, nDist, nCode);
        // decompress code length data
        const codeLenDict = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 2, 14, 1, 15];
        for (let i = 0; i < nCode; i += 1) {
          const curCodeLen = getBit(3);
          console.log(codeLenDict[i], curCodeLen);
        }
        throw 'final';
      },
      // reserved (error)
      3: () => { throw `reserved block header encountered at ${bytePtr}:${bitPtr}`; },
    };

    while (bytePtr < msg.length) {
      console.log(Array.from(msg).map(i => (256 + i).toString(2).slice(1)));
      console.log('current bit', msg[bytePtr].toString(2));

      const finalBit = getBit(1);
      if (finalBit) console.log('final bit found');

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

export default Deflate;
