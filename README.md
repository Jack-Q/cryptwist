# crypto-vis

> Cryptographic Algorithm Visualization

## Core Module Components

The core module components provide functionality for specific tasks. 

### Encoding Methods
* [-] Base64
  - [x] Basic Base64 ([RFC4648 (Section-4)](https://tools.ietf.org/html/rfc4648#section-4))
  - [ ] URL Compatible Base64 ([RFC4648 (Section-5)](https://tools.ietf.org/html/rfc4648#section-5))
  - [ ] GPG Ascii Armoring Variant ([RFC4880 (Section-6)](https://tools.ietf.org/html/rfc4880#section-6))
  - [ ] Without Padding ([RFC7515 (Appendix-C)](https://tools.ietf.org/html/rfc7515#appendix-C))
* [ ] Base32
  - [ ] Basic Base32 ([RFC4648 (Section-6)](https://tools.ietf.org/html/rfc4648#section-6))
  - [ ] Base32 Hex Ext ([RFC4648 (Section-7)](https://tools.ietf.org/html/rfc4648#section-7))
* [ ] Base16 ([RFC4648 (Section-8)](https://tools.ietf.org/html/rfc4648#section-8))
* [ ] Base36
* [ ] Base85
  - [ ] btoa version
  - [ ] Ascii85 (Adobe)

### Block Cipher Application Mode
 * [ ] ECB: Electronic Code Book
 * [ ] CBC: Cipher Block Chain
 * [ ] CFB: Cipher Feedback
 * [ ] OFB: Output Feedback
 * [ ] CTR: Counter

### Hash Functions
 * [ ] MD4
 * [ ] MD5
 * [ ] SHA-1
 * [ ] SHA-2
   - [ ] SHA-256
   - [ ] SHA-384
   - [ ] SHA-512
 * [ ] SHA-3 (Keccak)

### Pseudo-Random Number Generators / Stream Ciphers
 * [ ] RC4
 * [ ] RC4-MD5
 * [ ] Linear congruential generator 
 * [ ] Hash-based
 * [ ] Cipher-based
 * [ ] ANSI-X9.17

### Block Ciphers
 * [ ] DES
 * [ ] 3DES
 * [ ] IDEA
 * [ ] RC5
 * [ ] AES (Rijndeal)

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
