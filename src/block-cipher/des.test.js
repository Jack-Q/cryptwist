import { DESBlockCipher } from './des';
import Encoder from '../encode';

const { encode, decode } = Encoder.Base16Encoder;

const key = Uint8Array.of(
    0b00010011, 0b00110100, 0b01010111, 0b01111001,
    0b10011011, 0b10111100, 0b11011111, 0b11110001,
  );
const cipher = new DESBlockCipher(key);
const message = '0123456789ABCDEF';
const data = decode(message);
const cipherData = cipher.encrypt(data);
it('should encrypt message', () => expect(encode(cipherData)).toEqual('85E813540F0AB405'));
it('should decrypt message', () => expect(encode(cipher.decrypt(cipherData))).toEqual(message));


const tripleCipher = [
  '0123456789ABCDEF',
  '23456789ABCDEF01',
  '456789ABCDEF0123',
].map(k => new DESBlockCipher(decode(k)));

const tripleEncrypt = msg =>
  encode(tripleCipher.reduce((m, c, i) => (i === 1 ? c.decrypt(m) : c.encrypt(m)), decode(msg)));
const tripleDecrypt = s =>
  encode(tripleCipher.reduceRight((m, c, i) => (i === 1 ? c.encrypt(m) : c.decrypt(m)), decode(s)));
it('triple encryption', expect(tripleEncrypt('5468652071756663')).toEqual('A826FD8CE53B855F'));
it('triple decryption', expect(tripleDecrypt('A826FD8CE53B855F')).toEqual('5468652071756663'));

// for more test case, we can treat OpenSSL as reference implementation
// use following to encrypt message (with padding bytes) with key
// echo -n "message" | openssl des-ecb -nosalt -a -K "Base16 encoded key string"
