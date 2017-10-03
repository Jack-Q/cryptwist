# Cryptwist

> Cryptographic Algorithm Visualization

## Core Module Components

The core module components provide functionality for specific tasks. 

### Encoding Methods
* [-] Base64
  - [x] Basic Base64 ([RFC4648 (Section-4)](https://tools.ietf.org/html/rfc4648#section-4))
    + [ ] Without Padding ([RFC7515 (Appendix-C)](https://tools.ietf.org/html/rfc7515#appendix-C))
  - [ ] URL Compatible Base64 ([RFC4648 (Section-5)](https://tools.ietf.org/html/rfc4648#section-5))
  - [ ] GPG Ascii Armoring Variant ([RFC4880 (Section-6)](https://tools.ietf.org/html/rfc4880#section-6))
* [-] Base32
  - [-] Basic Base32 ([RFC4648 (Section-6)](https://tools.ietf.org/html/rfc4648#section-6))
    + [ ] Decoder Character Replacement (0 -> O, 1 -> I)
    + [ ] Decoder Character Case (lower to upper) & Replacement (1 -> l, I -> l)
  - [x] Base32 Hex Ext ([RFC4648 (Section-7)](https://tools.ietf.org/html/rfc4648#section-7))
* [x] Base16 ([RFC4648 (Section-8)](https://tools.ietf.org/html/rfc4648#section-8))
* [ ] Base36
* [-] Base85
  - [ ] btoa version
  - [x] Ascii85 (Adobe)

### Block Cipher Mode for Operation
 General Reference ([NIST](http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf))
 * [ ] ECB: Electronic Code Book
 * [ ] CBC: Cipher Block Chain
 * [ ] CFB: Cipher Feedback
   - [ ] OpenPGP CFB: ([RFC 4880 (Section-13.9)](https://tools.ietf.org/html/rfc4880#section-13.9))
 * [ ] OFB: Output Feedback
 * [ ] CTR: Counter

### Hash Functions
 * [x] MD4
 * [x] MD5
 * [x] SHA-1 ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf))
 * [ ] SHA-2 ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf))
   - [ ] SHA-256
   - [ ] SHA-384
   - [ ] SHA-512
 * [ ] SHA-3 (Keccak) ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf))

### Pseudo-Random Number Generators / Stream Ciphers
 * [x] RC4
 * [ ] RC4-MD5
 * [ ] Linear congruential generator 
 * [ ] Hash-based
 * [ ] Cipher-based
 * [ ] ANSI-X9.17

### Symmetric-Key Algorithms
 * [x] DES ([NIST](http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-67r1.pdf))
 * [x] 3DES ([NIST](http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-67r1.pdf))
 * [ ] IDEA
 * [ ] RC5
 * [ ] AES (Rijndeal) ([NIST](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf))
 * [ ] Twofish
 * [ ] Blowfish
 * [ ] CAST5

### Public-Key Algorithms
 * [ ] RSA
 * [ ] DSA
 * [ ] Elliptic Curve
 * [ ] Diffie-Hellman
 * [ ] ECDSA

### Compression Algorithms

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
