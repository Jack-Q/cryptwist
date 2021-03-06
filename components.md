# Supported Components in this package

## Encoding Methods

* [ ] Base64
  - [x] Basic Base64 ([RFC4648 (Section-4)](https://tools.ietf.org/html/rfc4648#section-4))
    + [ ] Without Padding ([RFC7515 (Appendix-C)](https://tools.ietf.org/html/rfc7515#appendix-C))
  - [ ] URL Compatible Base64 ([RFC4648 (Section-5)](https://tools.ietf.org/html/rfc4648#section-5))
  - [ ] GPG Ascii Armoring Variant ([RFC4880 (Section-6)](https://tools.ietf.org/html/rfc4880#section-6))
* [ ] Base32
  - [ ] Basic Base32 ([RFC4648 (Section-6)](https://tools.ietf.org/html/rfc4648#section-6))
    + [ ] Decoder Character Replacement (0 -> O, 1 -> I)
    + [ ] Decoder Character Case (lower to upper) & Replacement (1 -> l, I -> l)
  - [x] Base32 Hex Ext ([RFC4648 (Section-7)](https://tools.ietf.org/html/rfc4648#section-7))
* [x] Base16 ([RFC4648 (Section-8)](https://tools.ietf.org/html/rfc4648#section-8))
* [ ] Base36
* [ ] Base85
  - [ ] btoa version
  - [x] Ascii85 (Adobe)

## Block Cipher Mode for Operation

 General Reference ([NIST](http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf))
 * [x] ECB: Electronic Code Book
 * [x] CBC: Cipher Block Chain
 * [ ] CFB: Cipher Feedback
   - [x] Basic mode (CFB-n, where is the same as block size of underlay block cipher)
   - [ ] OpenPGP CFB: ([RFC 4880 (Section-13.9)](https://tools.ietf.org/html/rfc4880#section-13.9))
   - [ ] CFB-n mode
 * [x] OFB: Output Feedback
 * [x] CTR: Counter

## Hash Functions

 * [x] MD2 ([RFC1319](https://tools.ietf.org/html/rfc1319))
 * [x] MD4 ([RFC1319](https://tools.ietf.org/html/rfc1320))
 * [x] MD5 ([RFC1321](https://tools.ietf.org/html/rfc1321))
 * [x] RIPEMD
   - [x] RIPEMD 128 ([SPEC](http://homes.esat.kuleuven.be/~bosselae/ripemd/rmd128.txt))
   - [x] RIPEMD 160 ([SPEC](http://homes.esat.kuleuven.be/~bosselae/ripemd/rmd160.txt))
   - [x] RIPEMD 256 ([SPEC](http://homes.esat.kuleuven.be/~bosselae/ripemd/rmd256.txt))
   - [x] RIPEMD 320 ([SPEC](http://homes.esat.kuleuven.be/~bosselae/ripemd/rmd320.txt))
 * [x] SHA-1 ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf))
 * [x] SHA-2 ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf))
   - [x] SHA-224
   - [x] SHA-256
   - [x] SHA-384
   - [x] SHA-512
 * [x] SHA-3 (Keccak) ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf))
   - [x] SHA3-224
   - [x] SHA3-256
   - [x] SHA3-384
   - [x] SHA3-512
   - [x] SHAKE-128 XOF
   - [x] SHAKE-256 XOF

## Message Authentication Codes

 * [x] HMAC (Keyed-Hashing for Message Authentication) ([RFC2104](https://tools.ietf.org/html/rfc2104))
  - [x] HMAC-MD5 ([RFC2202](https://tools.ietf.org/html/rfc2202))
  - [x] HMAC-SHA-1 ([RFC2202](https://tools.ietf.org/html/rfc2202))
  - [x] HMAC-SHA-224 ([RFC4231](https://tools.ietf.org/html/rfc4231))
  - [x] HMAC-SHA-256 ([RFC4231](https://tools.ietf.org/html/rfc4231))
  - [x] HMAC-SHA-384 ([RFC4231](https://tools.ietf.org/html/rfc4231))
  - [x] HMAC-SHA-512 ([RFC4231](https://tools.ietf.org/html/rfc4231))

## Pseudo-Random Number Generators / Stream Ciphers

 * [x] RC4
 * [ ] RC4-MD5
 * [ ] Linear congruential generator
 * [ ] Hash-based
 * [ ] Cipher-based
 * [ ] ANSI-X9.17

## Symmetric-Key Algorithms

 * [x] DES ([NIST](http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-67r1.pdf))
 * [x] 3DES ([NIST](http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-67r1.pdf))
 * [x] IDEA ([PAPER](http://www.isiweb.ee.ethz.ch/papers/arch/xlai-mass-inspec-1991-2.pdf))
 * [ ] RC5 ([RFC2040](https://tools.ietf.org/html/rfc2040))
 * [ ] RC6 ([PAPER](http://people.csail.mit.edu/rivest/pubs/RRSY98.pdf))
 * [x] AES (Rijndeal) ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf))
   - [x] AES-128
   - [x] AES-192
   - [x] AES-256
 * [ ] Blowfish
 * [ ] Twofish
 * [ ] CAST5 (CAST-128) ([RFC2144](https://tools.ietf.org/html/rfc2144))
 * [ ] CAST6 (CAST-256) ([RFC2612](https://tools.ietf.org/html/rfc2612))
 * [ ] Camellia ([RFC3713](https://tools.ietf.org/html/rfc3713))
   - [ ] Camellia-128
   - [ ] Camellia-192
   - [ ] Camellia-256
 * [ ] SEED ([RFC4269](https://tools.ietf.org/html/rfc4269))

## Public-Key Algorithms

 * [ ] RSA
 * [ ] DSA
 * [ ] Elliptic Curve
 * [ ] Diffie-Hellman
 * [ ] ECDSA

## Compression Algorithms

 * [x] Zlib format ([RFC1950](https://tools.ietf.org/html/rfc1950))
   - [x] compress
   - [x] decompress
 * [x] DEFLATE format ([RFC1951](https://tools.ietf.org/html/rfc1951))
   - [x] compress
   - [x] decompress
 * [x] Gzip format ([RFC1952](https://tools.ietf.org/html/rfc1952))
   - [x] compress
   - [x] decompress
 * [ ] BZip2 format
   - [ ] compress
   - [ ] decompress
 * [ ] LZMA
 * [ ] LZMA2
 * [ ] lz4

## Key Derivation Function

 * [ ] PBKDF1 (Password Based Key Derivation Function) ([RFC8018](https://tools.ietf.org/html/rfc8018))
 * [ ] PBKDF2 (Password Based Key Derivation Function) ([RFC8018](https://tools.ietf.org/html/rfc8018))
 * [ ] HKDF (HMAC Based Key Derivation Function) ([RFC 5869](https://tools.ietf.org/html/rfc5869))
 * [ ] Argon2 ([Spec on GitHub](https://github.com/P-H-C/phc-winner-argon2/blob/master/argon2-specs.pdf))
