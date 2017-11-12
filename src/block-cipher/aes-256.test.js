import { AES256BlockCipher } from './aes-256';
import Encode from '../encode/index';
// echo -n '1234567890abcdef' | openssl aes-256-ecb -nosalt -nopad -a -K \
//    '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

const { Base64Encoder: Base64, HexEncoder: Hex } = Encode;

const w = m => Hex.encode(m);

const aseTest = ({ key, msg, result }) => {
  const cipher = new AES256BlockCipher(key);

  it('should encrypt message correctly', () => expect(w(cipher.encrypt(msg))).toEqual(w(result)));
  it('should decrypt message correctly', () => expect(w(cipher.decrypt(result))).toEqual(w(msg)));
};
[
  {
    msg: Uint8Array.from('1234567890abcdef'.split('').map(i => i.charCodeAt(0))),
    key: Hex.decode('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'),
    result: Base64.decode('h07K5BLXTOnLclifGUsXAA=='),
  },
  {
    key: Hex.decode('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'),
    msg: Hex.decode('00112233445566778899aabbccddeeff'),
    result: Hex.decode('8ea2b7ca516745bfeafc49904b496089'),
  },
].map(aseTest);

