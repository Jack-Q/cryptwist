declare namespace cryptwist {

  export declare namespace encoder {
    abstract class Encoder {
      /**
       * the name of current encoder
       */
      static title: string;

      /**
       * encode message using current encoder
       * 
       * @argument msg message to be encoded
       * @returns encoding result
       */
      static encode: (msg: Uint8Array) => Uint8Array;

      /**
       * decode message using current encoder (decoder)
       * 
       * @argument msg encoded message to be decoded
       * @returns decoding result
       */
      static decode: (code: Uint8Array) => Uint8Array;
    }

    export class Base64Encoder extends Encoder { }
    export class Base32Encoder extends Encoder { }
    export class Base16Encoder extends Encoder { }
    export class Base85Encoder extends Encoder { }
    export class HexEncoder extends Encoder { }
    export class AsciiArmoredEncoder extends Encoder { }
    export class AsciiEncoder extends Encoder { }

    const encoderList: Array<typeof Encoder>;
    const getEncoder: (string) => (typeof Encoder)?;
  }

  export declare namespace compressor {
    abstract class Compressor {
      /**
       * the name of current compressor
       */
      static title: string;

      /**
       * compress message using current compressor
       * 
       * @argument msg message to be compressed
       * @returns compression result
       */
      static compress: (msg: Uint8Array) => Uint8Array;

      /**
       * decompress message using current compressor (decompressor)
       * 
       * @argument msg compressed message to be decompressed
       * @returns decompression result
       */
      static decompress: (code: Uint8Array) => Uint8Array;
    }

    export class DeflateCompressor extends Compressor { };
    export class ZlibCompressor extends Compressor { };
    export class GzipCompressor extends Compressor { };

    const compressorList: Array<typeof Compressor>;
    const getCompressor: (string) => (typeof Compressor)?;
  }

  export declare namespace blockCipher {
    abstract class BlockCipher {
      /**
       * the name of current block cipher
       */
      static title: string;
      /**
       * construct lock cipher using key
       * @param key key used in the cipher
       */
      constructor(key: Uint8Array);
      /**
       * encrypt message using current cipher
       * 
       * @argument msg message to be encrypted
       * @returns encryption result
       */
      encrypt: (msg: Uint8Array) => Uint8Array;

      /**
       * decrypt message using current cipher
       * 
       * @argument cipher cipher text
       * @returns decrypted plain message
       */
      decrypt: (cipher: Uint8Array) => Uint8Array;
    }

    export class AES128BlockCipher extends BlockCipher { }
    export class AES192BlockCipher extends BlockCipher { }
    export class AES256BlockCipher extends BlockCipher { }
    export class DESBlockCipher extends BlockCipher { }
    export class TripleDESBlockCipher extends BlockCipher {
      constructor(key: Uint8Array | Array<Uint8Array>);
    }
    export class IDEABlockCipher extends BlockCipher { }
    const blockCipherList: Array<typeof BlockCipher>;
    const getBLockCipher: (string) => (typeof BlockCipher)?;
  }

  export declare namespace streamCipher {
    abstract class StreamCipher {
      /**
       * the name of current stream cipher
       */
      static title: string;

      /**
       * construct lock cipher using key
       * @param key key used in the cipher
       */
      constructor(key: Uint8Array);

      /**
       * get a bit stream generated from current key
       * 
       */
      get stream(): { next: () => ({ done: boolean, value: number }) };

      /**
       * encrypt message using current cipher
       * 
       * @argument msg message to be encrypted
       * @returns encryption result
       */
      encrypt: (msg: Uint8Array) => Uint8Array;

      /**
       * decrypt message using current cipher
       * 
       * @argument cipher cipher text
       * @returns decrypted plain message
       */
      decrypt: (cipher: Uint8Array) => Uint8Array;
    }

    export class RC4StreamCipher extends StreamCipher { }
    const streamCipherList: Array<typeof StreamCipher>;
    const getStreamCipher: (name: string) => (typeof StreamCipher)?;
  }

  export declare namespace hash {
    abstract class Hash {
      /**
       * the name of current hash method
       */
      static title: string;

      /**
       * feed more data segment to hash
       * @param data a segment of data
       */
      feedData(data: Uint8Array): void;

      /**
       * feed the last section of data
       * 
       * After invocation to this method, hash result is returned 
       * and the inner state of the hash object is reset.
       * 
       * @param data the last segment of data (optional)
       * @returns the hash result of all message segment
       */
      endData(data?: Uint8Array): Uint8Array;

      /**
       * reset the inner state of current hash object
       */
      reset(): void;

      /**
       * quick method to genrate hash usint current hash object
       * 
       * if current hash object is not clean (in process of generating 
       * hash of a serial data segment), a new temporary hash object 
       * with same initialization parameter is created.
       * 
       * @param data full message to be used to generate hash
       * @returns the hash of data
       */
      hash(data: Uint8Array): Uint8Array;

      /**
       * quick method to genrate hash usint current hash object
       * 
       * @param data full message to be used to generate hash
       * @returns the hash of data
       */
      static hash(data: Uint8Array): Uint8Array;
    }

    export class MD2Hash extends Hash { }
    export class MD4Hash extends Hash { }
    export class MD5Hash extends Hash { }
    export class RIPEMD128Hash extends Hash { }
    export class RIPEMD160Hash extends Hash { }
    export class RIPEMD256Hash extends Hash { }
    export class RIPEMD320Hash extends Hash { }
    export class SHA1Hash extends Hash { }
    export class SHA224Hash extends Hash { }
    export class SHA256Hash extends Hash { }
    export class SHA384Hash extends Hash { }
    export class SHA512Hash extends Hash { }
    export class SHA512t224Hash extends Hash { }
    export class SHA512t256Hash extends Hash { }
    export class SHA512THash extends Hash {
      constructor(t: number);
      static hash(data: Uint8Array, t: number): Uint8Array;
    }
    export class SHA3_224Hash extends Hash { }
    export class SHA3_256Hash extends Hash { }
    export class SHA3_384Hash extends Hash { }
    export class SHA3_512Hash extends Hash { }
    export class SHAKE128Hash extends Hash {
      constructor(d: number);
      static hash(data: Uint8Array, d: number): Uint8Array;
    }
    export class SHAKE256Hash extends Hash {
      constructor(d: number);
      static hash(data: Uint8Array, d: number): Uint8Array;
    }
    export class Hmac extends Hash {
      constructor(hashInst: Hash, blockLength: number, key: Uint8Array);
      static hash(data: Uint8Array, hashInst: Hash, blockLength: number, key: Uint8Array): Uint8Array;
    }
    abstract class HmacClass extends Hash {
      constructor(key: Uint8Array);
      static hash(data: Uint8Array, key: Uint8Array): Uint8Array;
    }
    export class HmacMD5 extends HmacClass { }
    export class HmacSHA1 extends HmacClass { }
    export class HmacSHA224 extends HmacClass { }
    export class HmacSHA256 extends HmacClass { }
    export class HmacSHA384 extends HmacClass { }
    export class HmacSHA512 extends HmacClass { }

    const hashList: Array<typeof Hash>;
    const getHash: (name: string) => (typeof Hash)?;
  }
}

export default cryptwist;
