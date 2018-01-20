import { SHA224Hash } from './sha-224';
import Encode from '../encode';

const test = (msg, md) => it(`should hash "${msg}" to "${md}"`, () => expect(Encode.Base16Encoder.encode(SHA224Hash.hash(Uint8Array.from(msg.split('').map(i => i.charCodeAt(0)))))).toEqual(md.toUpperCase()));

// Here cen use OpenSSL as reference implementation,
// echo -n "message" | openssl dgst -sha224

const testCases = [
  ['', 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f'],
  ['\0', 'fff9292b4201617bdc4d3053fce02734166a683d7d858a7f5f59b073'],
  ['Hello World', 'c4890faffdb0105d991a461e668e276685401b02eab1ef4372795047'],
  ['The quick brown fox jumps over the lazy dog', '730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525'],
  ['The quick brown fox jumps over the lazy dog.', '619cba8e8e05826e9b8c519c0a5c68f4fb653e8a3d8aa04bb2c8cd4c'],
];

testCases.forEach(i => test(...i));

it('should hash large data correctly', () => expect(Encode.Base16Encoder.encode(SHA224Hash.hash(new Uint8Array(12000)))).toEqual('E0FCD9AAED573EF4E55F084965B34807671FC15D6F3776CF101A6612'));
