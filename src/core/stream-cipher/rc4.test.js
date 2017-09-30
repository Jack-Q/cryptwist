import { prga, ksa, RC4StreamCipher } from './rc4';
import Base64 from '../encode/base64';

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

