import { prga, ksa, RC4StreamCipher } from './rc4';
import Encoder from '../encode/index';

const { Base64Encoder: Base64 } = Encoder;

const key = Base64.decode('ZSDAABC45sD+CC+=');
const cipher = new RC4StreamCipher(key);
it('should keep the result of decryption the same as input', () => expect(cipher.decrypt(cipher.encrypt(key))).toEqual(key));
it('cipher should encrypt the message to other value', () => expect(cipher.encrypt(key)).not.toEqual(key));

const createStream = (size = 100, stream = cipher.stream) =>
  Array(100).fill(0).map(() => stream.next().value);
it('should be the same stream for the same key', () => expect(createStream()).toEqual(createStream()));

it('should encrypt message as expectation', () =>
  expect(Base64.encode(cipher.encrypt(Base64.decode('HelloWorld++')))).toEqual('ipezNljMxlvm'));

it('should validate the length of key longer then minimal', () => expect(() =>
  new RC4StreamCipher(Uint8Array.from([])).stream).toThrow(/length/));
it('should validate the length of key shorter then the maximal', () => expect(() =>
  new RC4StreamCipher(Uint8Array.from(Array(260).fill(0))).stream).toThrow(/length/));

// for more test case, we can treat OpenSSL as reference implementation
// use following to encrypt message (with padding bytes) with key
// echo -n "message" | openssl rc4 -nosalt -a -K "Base16 encoded key string"
